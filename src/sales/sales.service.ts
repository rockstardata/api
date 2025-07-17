import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, PaymentMethod, SaleStatus } from './entities/sale.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { PermissionsService } from 'src/auth/permissions.service';
import { PermissionType } from 'src/auth/enums/permission-type.enum';
import { ResourceType } from 'src/auth/enums/resource-type.enum';
import { SyncService } from '../database/sync.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    private readonly permissionsService: PermissionsService,
    private readonly syncService: SyncService,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId?: number): Promise<Sale> {
    const saleData: Partial<Sale> = {
      productName: createSaleDto.productName,
      quantity: createSaleDto.quantity,
      price: createSaleDto.price,
      totalAmount: createSaleDto.quantity * createSaleDto.price,
      paymentMethod: createSaleDto.paymentMethod || PaymentMethod.CASH,
      status: createSaleDto.status || SaleStatus.COMPLETED,
      notes: createSaleDto.notes,
      createdBy: userId ? { id: userId } as User : undefined,
    };

    if (createSaleDto.venueId) {
      // Si se especifica venueId, obtener el local
      const venue = await this.venueRepository.findOne({
        where: { id: createSaleDto.venueId },
      });
      
      if (!venue) {
        throw new NotFoundException(`Venue with ID ${createSaleDto.venueId} not found`);
      }
      
      saleData.venue = { id: createSaleDto.venueId } as any;
    }
    
    const sale = this.saleRepository.create(saleData);
    const savedSale = await this.saleRepository.save(sale);
    
    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Sale', 'create', savedSale).catch(error => {
      console.error('Failed to sync sale creation to external DB:', error);
    });
    
    return savedSale;
  }

  async findAll(userId?: number): Promise<Sale[]> {
    // Si no hay userId, retornar todas las ventas sin verificación de permisos
    if (!userId) {
      return await this.saleRepository.find({
        relations: ['createdBy', 'venue'],
        take: 100, // Limitar a 100 registros para evitar sobrecarga
        order: { createdAt: 'DESC' }, // Ordenar por fecha de creación descendente
      });
    }

    // Si hay userId, verificar permisos
    try {
      const userPermissions = await this.permissionsService.getUserPermissions(userId);
      
      // Si no tiene permisos específicos, retornar solo sus propias ventas
      const salesPermissions = userPermissions.filter(
        p => p.permissionType === PermissionType.ViewSales
      );

      if (salesPermissions.length === 0) {
        return await this.findByUser(userId);
      }

      // Construir query basado en permisos
      const queryBuilder = this.saleRepository.createQueryBuilder('sale')
        .leftJoinAndSelect('sale.createdBy', 'createdBy')
        .leftJoinAndSelect('sale.venue', 'venue')
        .take(100) // Limitar resultados
        .orderBy('sale.createdAt', 'DESC');

      const conditions: string[] = [];
      const parameters: any = {};

      for (const permission of salesPermissions) {
        if (permission.resourceType === ResourceType.Organization) {
          conditions.push('venue.company.organizationId = :orgId');
          parameters['orgId'] = permission.resourceId;
        } else if (permission.resourceType === ResourceType.Company) {
          conditions.push('venue.companyId = :companyId');
          parameters['companyId'] = permission.resourceId;
        } else if (permission.resourceType === ResourceType.Venue) {
          conditions.push('sale.venueId = :venueId');
          parameters['venueId'] = permission.resourceId;
        }
      }

      if (conditions.length > 0) {
        queryBuilder.where(`(${conditions.join(' OR ')})`, parameters);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      // Si hay error en permisos, retornar solo las ventas del usuario
      console.error('Error checking permissions, falling back to user sales:', error);
      return await this.findByUser(userId);
    }
  }

  async findOne(id: number, userId?: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['createdBy', 'venue'],
    });
    
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    // Verificar permisos si se proporciona userId
    if (userId && !(await this.canAccessSale(userId, sale))) {
      throw new ForbiddenException('You do not have permission to access this sale');
    }
    
    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto, userId?: number): Promise<Sale> {
    const sale = await this.findOne(id, userId);
    
    // Verificar permisos de actualización
    if (userId && !(await this.hasUpdatePermission(userId, sale))) {
      throw new ForbiddenException('You do not have permission to update this sale');
    }
    
    Object.assign(sale, updateSaleDto);
    const updatedSale = await this.saleRepository.save(sale);
    
    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Sale', 'update', updatedSale).catch(error => {
      console.error('Failed to sync sale update to external DB:', error);
    });
    
    return updatedSale;
  }

  async remove(id: number, userId?: number): Promise<void> {
    const sale = await this.findOne(id, userId);
    
    // Verificar permisos de eliminación
    if (userId && !(await this.hasDeletePermission(userId, sale))) {
      throw new ForbiddenException('You do not have permission to delete this sale');
    }
    
    await this.saleRepository.remove(sale);
    
    // Sincronizar eliminación con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Sale', 'delete', { id }).catch(error => {
      console.error('Failed to sync sale deletion to external DB:', error);
    });
  }

  async findByVenue(venueId: number, userId?: number): Promise<Sale[]> {
    // Verificar permisos
    if (userId && !(await this.permissionsService.hasPermission(
      userId, 
      PermissionType.ViewSales, 
      ResourceType.Venue, 
      venueId
    ))) {
      throw new ForbiddenException('You do not have permission to view sales for this venue');
    }

    return await this.saleRepository.find({
      where: { venue: { id: venueId } },
      relations: ['createdBy', 'venue'],
    });
  }

  async findByUser(userId: number): Promise<Sale[]> {
    return await this.saleRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['createdBy', 'venue'],
    });
  }

  async getSalesSummary(venueId?: number, userId?: number): Promise<any> {
    const queryBuilder = this.saleRepository.createQueryBuilder('sale');
    
    if (venueId) {
      queryBuilder.where('sale.venueId = :venueId', { venueId });
    }

    const totalSales = await queryBuilder.getCount();
    const totalAmount = await queryBuilder
      .select('SUM(sale.totalAmount)', 'total')
      .getRawOne();

    return {
      totalSales,
      totalAmount: totalAmount?.total || 0,
    };
  }

  async getSalesByDateRange(
    startDate: Date,
    endDate: Date,
    venueId?: number,
    userId?: number
  ): Promise<Sale[]> {
    const queryBuilder = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.createdBy', 'createdBy')
      .leftJoinAndSelect('sale.venue', 'venue')
      .where('sale.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (venueId) {
      queryBuilder.andWhere('sale.venueId = :venueId', { venueId });
    }

    return await queryBuilder.getMany();
  }

  async getSalesByPaymentMethod(
    paymentMethod: PaymentMethod,
    venueId?: number,
    userId?: number
  ): Promise<Sale[]> {
    const queryBuilder = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.createdBy', 'createdBy')
      .leftJoinAndSelect('sale.venue', 'venue')
      .where('sale.paymentMethod = :paymentMethod', { paymentMethod });

    if (venueId) {
      queryBuilder.andWhere('sale.venueId = :venueId', { venueId });
    }

    return await queryBuilder.getMany();
  }

  async getSalesByStatus(
    status: SaleStatus,
    venueId?: number,
    userId?: number
  ): Promise<Sale[]> {
    const queryBuilder = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.createdBy', 'createdBy')
      .leftJoinAndSelect('sale.venue', 'venue')
      .where('sale.status = :status', { status });

    if (venueId) {
      queryBuilder.andWhere('sale.venueId = :venueId', { venueId });
    }

    return await queryBuilder.getMany();
  }

  async getSalesFromYearStartToNextMonth(): Promise<Sale[]> {
    const startDate = new Date(new Date().getFullYear(), 0, 1); // 1 de enero del año actual
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1, 1); // Primer día del mes siguiente
    nextMonth.setHours(0, 0, 0, 0);

    return this.saleRepository.createQueryBuilder('sale')
      .where('sale.createdAt >= :startDate', { startDate })
      .andWhere('sale.createdAt < :nextMonth', { nextMonth })
      .take(20)
      .getMany();
  }

  async getSalesByMonthAndYear(month: number, year: number, page: number = 1): Promise<Sale[]> {
    // Calcular el primer día del mes
    const startDate = new Date(year, month - 1, 1);
    // Calcular el primer día del mes siguiente
    const endDate = new Date(year, month, 1);
    // Paginación
    const take = 10;
    const skip = (page - 1) * take;

    return this.saleRepository.createQueryBuilder('sale')
      .where('sale.createdAt >= :startDate', { startDate })
      .andWhere('sale.createdAt < :endDate', { endDate })
      .take(take)
      .skip(skip)
      .getMany();
  }

  private async canAccessSale(userId: number, sale: Sale): Promise<boolean> {
    // Si el usuario creó la venta, puede acceder
    if (sale.createdBy?.id === userId) {
      return true;
    }

    // Verificar permisos específicos
    if (sale.venue?.company?.organization?.id) {
      return await this.permissionsService.hasPermission(
        userId,
        PermissionType.ViewSales,
        ResourceType.Organization,
        sale.venue.company.organization.id
      );
    }

    if (sale.venue?.company?.id) {
      return await this.permissionsService.hasPermission(
        userId,
        PermissionType.ViewSales,
        ResourceType.Company,
        sale.venue.company.id
      );
    }

    if (sale.venue?.id) {
      return await this.permissionsService.hasPermission(
        userId,
        PermissionType.ViewSales,
        ResourceType.Venue,
        sale.venue.id
      );
    }

    return false;
  }

  private async hasUpdatePermission(userId: number, sale: Sale): Promise<boolean> {
    return await this.permissionsService.hasPermission(userId, PermissionType.UpdateSales, ResourceType.Venue, sale.venue?.id);
  }

  private async hasDeletePermission(userId: number, sale: Sale): Promise<boolean> {
    return await this.permissionsService.hasPermission(userId, PermissionType.DeleteSales, ResourceType.Venue, sale.venue?.id);
  }
}