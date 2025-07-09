import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PermissionsService } from 'src/auth/permissions.service';
import { PermissionType } from 'src/auth/enums/permission-type.enum';
import { ResourceType } from 'src/auth/enums/resource-type.enum';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Business } from 'src/business/entities/business.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly permissionsService: PermissionsService,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId?: number): Promise<Sale> {
    const saleData: Partial<Sale> = {
      ...createSaleDto,
    };
    
    if (userId) {
      saleData.createdBy = { id: userId } as any;
    }
    
    // Manejar relaciones automáticamente
    if (createSaleDto.ticketId) {
      // Si se especifica ticketId, obtener el ticket y sus relaciones
      const ticket = await this.ticketRepository.findOne({
        where: { id: createSaleDto.ticketId },
        relations: ['venue', 'business'],
      });
      
      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${createSaleDto.ticketId} not found`);
      }
      
      saleData.ticket = { id: createSaleDto.ticketId } as any;
      
      // Verificar si el ticket tiene venue y business
      if (ticket.venue) {
        saleData.venue = { id: ticket.venue.id } as any;
      }
      if (ticket.business) {
        saleData.business = { id: ticket.business.id } as any;
      }
      
    } else if (createSaleDto.venueId) {
      // Si se especifica venueId, obtener el local y su negocio
      const venue = await this.venueRepository.findOne({
        where: { id: createSaleDto.venueId },
        relations: ['business'],
      });
      
      if (!venue) {
        throw new NotFoundException(`Venue with ID ${createSaleDto.venueId} not found`);
      }
      
      saleData.venue = { id: createSaleDto.venueId } as any;
      
      // Verificar si el venue tiene business
      if (venue.business) {
        saleData.business = { id: venue.business.id } as any;
      }
      
    } else if (createSaleDto.businessId) {
      // Si se especifica businessId, solo asignar el negocio
      const business = await this.businessRepository.findOne({
        where: { id: createSaleDto.businessId },
      });
      
      if (!business) {
        throw new NotFoundException(`Business with ID ${createSaleDto.businessId} not found`);
      }
      
      saleData.business = { id: createSaleDto.businessId } as any;
    }
    
    const sale = this.saleRepository.create(saleData);
    return await this.saleRepository.save(sale);
  }

  async findAll(userId?: number): Promise<Sale[]> {
    if (!userId) {
      return await this.saleRepository.find({
        relations: ['ticket', 'createdBy', 'venue', 'business'],
      });
    }

    // Obtener permisos del usuario
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
      .leftJoinAndSelect('sale.ticket', 'ticket')
      .leftJoinAndSelect('sale.createdBy', 'createdBy')
      .leftJoinAndSelect('sale.venue', 'venue')
      .leftJoinAndSelect('sale.business', 'business');

    const conditions: string[] = [];
    const parameters: any = {};

    for (const permission of salesPermissions) {
      if (permission.resourceType === ResourceType.Organization) {
        conditions.push('business.organizationId = :orgId');
        parameters['orgId'] = permission.resourceId;
      } else if (permission.resourceType === ResourceType.Business) {
        conditions.push('sale.businessId = :businessId');
        parameters['businessId'] = permission.resourceId;
      } else if (permission.resourceType === ResourceType.Venue) {
        conditions.push('sale.venueId = :venueId');
        parameters['venueId'] = permission.resourceId;
      }
    }

    if (conditions.length > 0) {
      queryBuilder.where(`(${conditions.join(' OR ')})`, parameters);
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number, userId?: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['ticket', 'createdBy', 'venue', 'business'],
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
    return await this.saleRepository.save(sale);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const sale = await this.findOne(id, userId);
    
    // Verificar permisos de eliminación
    if (userId && !(await this.hasDeletePermission(userId, sale))) {
      throw new ForbiddenException('You do not have permission to delete this sale');
    }
    
    await this.saleRepository.remove(sale);
  }

  async findByBusiness(businessId: number, userId?: number): Promise<Sale[]> {
    // Verificar permisos
    if (userId && !(await this.permissionsService.hasPermission(
      userId, 
      PermissionType.ViewSales, 
      ResourceType.Business, 
      businessId
    ))) {
      throw new ForbiddenException('You do not have permission to view sales for this business');
    }

    return await this.saleRepository.find({
      where: { business: { id: businessId } },
      relations: ['ticket', 'createdBy', 'venue', 'business'],
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
      relations: ['ticket', 'createdBy', 'venue', 'business'],
    });
  }

  async findByUser(userId: number): Promise<Sale[]> {
    return await this.saleRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['ticket', 'createdBy', 'venue', 'business'],
    });
  }

  async getSalesSummary(businessId?: number, venueId?: number, userId?: number): Promise<any> {
    const queryBuilder = this.saleRepository.createQueryBuilder('sale');
    
    if (businessId) {
      // Verificar permisos para el negocio
      if (userId && !(await this.permissionsService.hasPermission(
        userId, 
        PermissionType.ViewSales, 
        ResourceType.Business, 
        businessId
      ))) {
        throw new ForbiddenException('You do not have permission to view sales summary for this business');
      }
      queryBuilder.where('sale.businessId = :businessId', { businessId });
    }
    
    if (venueId) {
      // Verificar permisos para el local
      if (userId && !(await this.permissionsService.hasPermission(
        userId, 
        PermissionType.ViewSales, 
        ResourceType.Venue, 
        venueId
      ))) {
        throw new ForbiddenException('You do not have permission to view sales summary for this venue');
      }
      queryBuilder.andWhere('sale.venueId = :venueId', { venueId });
    }
    
    const totalSales = await queryBuilder.getCount();
    const totalAmount = await queryBuilder
      .select('SUM(sale.totalAmount)', 'total')
      .getRawOne();
    
    return {
      totalSales,
      totalAmount: parseFloat(totalAmount?.total || '0'),
    };
  }

  private async canAccessSale(userId: number, sale: Sale): Promise<boolean> {
    // Si el usuario creó la venta, puede acceder
    if (sale.createdBy?.id === userId) {
      return true;
    }

    // Verificar permisos por organización
    if (sale.business?.organization?.id) {
      if (await this.permissionsService.hasPermission(
        userId, 
        PermissionType.ViewSales, 
        ResourceType.Organization, 
        sale.business.organization.id
      )) {
        return true;
      }
    }

    // Verificar permisos por negocio
    if (sale.business?.id) {
      if (await this.permissionsService.hasPermission(
        userId, 
        PermissionType.ViewSales, 
        ResourceType.Business, 
        sale.business.id
      )) {
        return true;
      }
    }

    // Verificar permisos por local
    if (sale.venue?.id) {
      if (await this.permissionsService.hasPermission(
        userId, 
        PermissionType.ViewSales, 
        ResourceType.Venue, 
        sale.venue.id
      )) {
        return true;
      }
    }

    return false;
  }

  private async hasUpdatePermission(userId: number, sale: Sale): Promise<boolean> {
    // Verificar permisos de actualización similares a los de acceso
    return await this.canAccessSale(userId, sale);
  }

  private async hasDeletePermission(userId: number, sale: Sale): Promise<boolean> {
    // Verificar permisos de eliminación similares a los de acceso
    return await this.canAccessSale(userId, sale);
  }
}