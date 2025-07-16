import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income, IncomeCategory, IncomeStatus } from './entities/income.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly syncService: SyncService,
  ) {}

  async create(createIncomeDto: CreateIncomeDto, userId: number) {
    const venue = await this.venueRepository.findOne({
      where: { id: createIncomeDto.venueId },
    });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    const income = this.incomeRepository.create({
      ...createIncomeDto,
      venue,
      createdBy: { id: userId },
      date: new Date(createIncomeDto.date),
      dueDate: createIncomeDto.dueDate ? new Date(createIncomeDto.dueDate) : null,
    });

    if (createIncomeDto.saleId) {
      const sale = await this.saleRepository.findOne({
        where: { id: createIncomeDto.saleId },
      });
      if (sale) {
        income.sale = sale;
      }
    }

    if (createIncomeDto.receivedById) {
      const receivedBy = await this.userRepository.findOne({
        where: { id: createIncomeDto.receivedById },
      });
      if (receivedBy) {
        income.receivedBy = receivedBy;
      }
    }

    const savedIncome = await this.incomeRepository.save(income);
    this.syncService.syncEntity('Income', 'create', savedIncome).catch(error => {
      console.error('Failed to sync income creation to external DB:', error);
    });
    return savedIncome;
  }

  async findAll(venueId?: number, category?: string) {
    const query = this.incomeRepository.createQueryBuilder('income')
      .leftJoinAndSelect('income.venue', 'venue')
      .leftJoinAndSelect('income.sale', 'sale')
      .leftJoinAndSelect('income.createdBy', 'createdBy')
      .leftJoinAndSelect('income.receivedBy', 'receivedBy');

    if (venueId) {
      query.where('venue.id = :venueId', { venueId });
    }

    if (category) {
      query.andWhere('income.category = :category', { category });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const income = await this.incomeRepository.findOne({
      where: { id },
      relations: ['venue', 'sale', 'createdBy', 'receivedBy'],
    });

    if (!income) {
      throw new NotFoundException(`Income with ID ${id} not found`);
    }

    return income;
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto, userId: number) {
    const income = await this.findOne(id);

    if (updateIncomeDto.venueId) {
      const venue = await this.venueRepository.findOne({
        where: { id: updateIncomeDto.venueId },
      });
      if (venue) {
        income.venue = venue;
      }
    }

    if (updateIncomeDto.saleId) {
      const sale = await this.saleRepository.findOne({
        where: { id: updateIncomeDto.saleId },
      });
      if (sale) {
        income.sale = sale;
      }
    }

    if (updateIncomeDto.receivedById) {
      const receivedBy = await this.userRepository.findOne({
        where: { id: updateIncomeDto.receivedById },
      });
      if (receivedBy) {
        income.receivedBy = receivedBy;
      }
    }

    if (updateIncomeDto.date) {
      income.date = new Date(updateIncomeDto.date);
    }

    if (updateIncomeDto.dueDate) {
      income.dueDate = new Date(updateIncomeDto.dueDate);
    }

    Object.assign(income, updateIncomeDto);
    const updatedIncome = await this.incomeRepository.save(income);
    this.syncService.syncEntity('Income', 'update', updatedIncome).catch(error => {
      console.error('Failed to sync income update to external DB:', error);
    });
    return updatedIncome;
  }

  async remove(id: number) {
    const income = await this.findOne(id);
    await this.incomeRepository.remove(income);
    this.syncService.syncEntity('Income', 'delete', { id }).catch(error => {
      console.error('Failed to sync income deletion to external DB:', error);
    });
  }

  async findByVenue(venueId: number) {
    return this.incomeRepository.find({
      where: { venue: { id: venueId } },
      relations: ['venue', 'sale', 'createdBy', 'receivedBy'],
    });
  }

  async findByCategory(category: IncomeCategory) {
    return this.incomeRepository.find({
      where: { category },
      relations: ['venue'],
    });
  }

  async findByStatus(status: IncomeStatus) {
    return this.incomeRepository.find({
      where: { status },
      relations: ['venue'],
    });
  }

  async findBySaleId(saleId: number) {
    return this.incomeRepository.findOne({ where: { sale: { id: saleId } } });
  }

  async getTotalIncomeByVenue(venueId: number, startDate?: Date, endDate?: Date) {
    const query = this.incomeRepository
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.venue.id = :venueId', { venueId });

    if (startDate && endDate) {
      query.andWhere('income.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const result = await query.getRawOne();
    return result?.total || 0;
  }

  async getPendingIncome(venueId?: number) {
    const query = this.incomeRepository
      .createQueryBuilder('income')
      .leftJoinAndSelect('income.venue', 'venue')
      .where('income.status = :status', { status: 'pending' });

    if (venueId) {
      query.andWhere('venue.id = :venueId', { venueId });
    }

    return query.getMany();
  }

  async markAsReceived(id: number, userId: number) {
    const income = await this.findOne(id);
    income.status = IncomeStatus.RECEIVED;
    income.receivedBy = { id: userId } as User;
    return this.incomeRepository.save(income);
  }

  async getIncomeOverview(venueId: number | undefined, year: number, month: number) {
    // Fechas del mes actual
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Fechas del mismo mes del año anterior
    const prevYear = year - 1;
    const prevStartDate = new Date(prevYear, month - 1, 1);
    const prevEndDate = new Date(prevYear, month, 1);

    // Query para ingresos actuales
    const currentQuery = this.incomeRepository.createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.date >= :startDate AND income.date < :endDate', { startDate, endDate });

    // Query para ingresos año anterior
    const prevQuery = this.incomeRepository.createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.date >= :prevStartDate AND income.date < :prevEndDate', { prevStartDate, prevEndDate });

    if (venueId) {
      currentQuery.andWhere('income.venue = :venueId', { venueId });
      prevQuery.andWhere('income.venue = :venueId', { venueId });
    }

    const current = await currentQuery.getRawOne();
    const previous = await prevQuery.getRawOne();

    const totalCurrent = Number(current.total) || 0;
    const totalPrevious = Number(previous.total) || 0;
    const growth = totalPrevious > 0 ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : null;

    return {
      totalCurrent,
      totalPrevious,
      growthPercent: growth !== null ? Math.round(growth * 100) / 100 : null,
    };
  }

  /**
   * Obtiene todos los ingresos de un local en un rango de fechas específico
   * @param venueId ID del local/restaurante
   * @param startDate Fecha de inicio (YYYY-MM-DD)
   * @param endDate Fecha de fin (YYYY-MM-DD)
   * @param page Número de página (opcional, por defecto 1)
   * @param limit Límite de registros por página (opcional, por defecto 50)
   * @returns Lista paginada de ingresos con sus relaciones
   */
  async getIncomeByDateRange(
    venueId: number,
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 50
  ) {
    // Convertir fechas string a Date
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validar fechas
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Fechas inválidas. Use formato YYYY-MM-DD');
    }
    
    if (start > end) {
      throw new Error('La fecha de inicio debe ser menor o igual a la fecha de fin');
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Query principal con relaciones
    const query = this.incomeRepository.createQueryBuilder('income')
      .leftJoinAndSelect('income.venue', 'venue')
      .leftJoinAndSelect('income.sale', 'sale')
      .leftJoinAndSelect('income.createdBy', 'createdBy')
      .leftJoinAndSelect('income.receivedBy', 'receivedBy')
      .where('income.venue.id = :venueId', { venueId })
      .andWhere('income.date >= :startDate', { startDate: start })
      .andWhere('income.date <= :endDate', { endDate: end })
      .orderBy('income.date', 'DESC')
      .addOrderBy('income.id', 'DESC')
      .skip(offset)
      .take(limit);

    // Ejecutar query
    const [incomes, total] = await query.getManyAndCount();

    // Calcular total de ingresos en el rango
    const totalAmountQuery = this.incomeRepository.createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.venue.id = :venueId', { venueId })
      .andWhere('income.date >= :startDate', { startDate: start })
      .andWhere('income.date <= :endDate', { endDate: end });

    const totalAmountResult = await totalAmountQuery.getRawOne();
    const totalAmount = Number(totalAmountResult?.total) || 0;

    // Calcular estadísticas por categoría
    const categoryStatsQuery = this.incomeRepository.createQueryBuilder('income')
      .select('income.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(income.amount)', 'total')
      .where('income.venue.id = :venueId', { venueId })
      .andWhere('income.date >= :startDate', { startDate: start })
      .andWhere('income.date <= :endDate', { endDate: end })
      .groupBy('income.category')
      .orderBy('SUM(income.amount)', 'DESC');

    const categoryStats = await categoryStatsQuery.getRawMany();

    return {
      incomes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      summary: {
        totalAmount,
        totalRecords: total,
        dateRange: {
          start: startDate,
          end: endDate
        },
        categoryStats
      }
    };
  }
}
