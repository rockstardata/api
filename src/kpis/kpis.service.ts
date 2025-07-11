import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { Kpi, KpiType, KpiPeriod } from './entities/kpi.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Injectable()
export class KpisService {
  constructor(
    @InjectRepository(Kpi)
    private kpiRepository: Repository<Kpi>,
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly syncService: SyncService,
  ) {}

  async create(createKpiDto: CreateKpiDto, userId: number) {
    const venue = await this.venueRepository.findOne({
      where: { id: createKpiDto.venueId },
    });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    const kpi = this.kpiRepository.create({
      ...createKpiDto,
      venue,
      createdBy: { id: userId },
      startDate: new Date(createKpiDto.startDate),
      endDate: new Date(createKpiDto.endDate),
    });

    if (createKpiDto.responsiblePersonId) {
      const responsiblePerson = await this.userRepository.findOne({
        where: { id: createKpiDto.responsiblePersonId },
      });
      if (responsiblePerson) {
        kpi.responsiblePerson = responsiblePerson;
      }
    }

    // Calcular porcentaje si se proporciona valor actual
    if (createKpiDto.actualValue && createKpiDto.targetValue) {
      kpi.percentage = (createKpiDto.actualValue / createKpiDto.targetValue) * 100;
    }

    const savedKpi = await this.kpiRepository.save(kpi);
    this.syncService.syncEntity('Kpi', 'create', savedKpi).catch(error => {
      console.error('Failed to sync kpi creation to external DB:', error);
    });
    return savedKpi;
  }

  async findAll(venueId?: number, type?: string) {
    const query = this.kpiRepository.createQueryBuilder('kpi')
      .leftJoinAndSelect('kpi.venue', 'venue')
      .leftJoinAndSelect('kpi.createdBy', 'createdBy')
      .leftJoinAndSelect('kpi.responsiblePerson', 'responsiblePerson');

    if (venueId) {
      query.where('venue.id = :venueId', { venueId });
    }

    if (type) {
      query.andWhere('kpi.type = :type', { type });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const kpi = await this.kpiRepository.findOne({
      where: { id },
      relations: ['venue', 'createdBy', 'responsiblePerson'],
    });

    if (!kpi) {
      throw new NotFoundException(`KPI with ID ${id} not found`);
    }

    return kpi;
  }

  async update(id: number, updateKpiDto: UpdateKpiDto, userId: number) {
    const kpi = await this.findOne(id);

    if (updateKpiDto.venueId) {
      const venue = await this.venueRepository.findOne({
        where: { id: updateKpiDto.venueId },
      });
      if (venue) {
        kpi.venue = venue;
      }
    }

    if (updateKpiDto.responsiblePersonId) {
      const responsiblePerson = await this.userRepository.findOne({
        where: { id: updateKpiDto.responsiblePersonId },
      });
      if (responsiblePerson) {
        kpi.responsiblePerson = responsiblePerson;
      }
    }

    if (updateKpiDto.startDate) {
      kpi.startDate = new Date(updateKpiDto.startDate);
    }

    if (updateKpiDto.endDate) {
      kpi.endDate = new Date(updateKpiDto.endDate);
    }

    Object.assign(kpi, updateKpiDto);

    // Recalcular porcentaje si se actualiza el valor actual o objetivo
    if (kpi.actualValue && kpi.targetValue) {
      kpi.percentage = (kpi.actualValue / kpi.targetValue) * 100;
    }

    const updatedKpi = await this.kpiRepository.save(kpi);
    this.syncService.syncEntity('Kpi', 'update', updatedKpi).catch(error => {
      console.error('Failed to sync kpi update to external DB:', error);
    });
    return updatedKpi;
  }

  async remove(id: number) {
    const kpi = await this.findOne(id);
    await this.kpiRepository.remove(kpi);
    this.syncService.syncEntity('Kpi', 'delete', { id }).catch(error => {
      console.error('Failed to sync kpi deletion to external DB:', error);
    });
  }

  async findByVenue(venueId: number) {
    return this.kpiRepository.find({
      where: { venue: { id: venueId } },
      relations: ['venue', 'createdBy', 'responsiblePerson'],
    });
  }

  async findByType(type: KpiType) {
    return this.kpiRepository.find({
      where: { type },
      relations: ['venue'],
    });
  }

  async findByPeriod(period: KpiPeriod) {
    return this.kpiRepository.find({
      where: { period },
      relations: ['venue'],
    });
  }

  async updateActualValue(id: number, actualValue: number) {
    const kpi = await this.findOne(id);
    kpi.actualValue = actualValue;
    kpi.percentage = (actualValue / kpi.targetValue) * 100;
    return this.kpiRepository.save(kpi);
  }

  async getKpiPerformance(venueId: number, type?: string) {
    const query = this.kpiRepository
      .createQueryBuilder('kpi')
      .select([
        'kpi.type',
        'AVG(kpi.percentage) as avgPercentage',
        'COUNT(kpi.id) as totalKpis',
        'SUM(CASE WHEN kpi.percentage >= 100 THEN 1 ELSE 0 END) as achievedKpis'
      ])
      .where('kpi.venue.id = :venueId', { venueId });

    if (type) {
      query.andWhere('kpi.type = :type', { type });
    }

    query.groupBy('kpi.type');
    return query.getRawMany();
  }

  async getOverdueKpis(venueId?: number) {
    const query = this.kpiRepository
      .createQueryBuilder('kpi')
      .leftJoinAndSelect('kpi.venue', 'venue')
      .where('kpi.endDate < :today', { today: new Date() })
      .andWhere('kpi.percentage < 100');

    if (venueId) {
      query.andWhere('venue.id = :venueId', { venueId });
    }

    return query.getMany();
  }

  async getTopPerformers(venueId: number, limit: number = 5) {
    return this.kpiRepository
      .createQueryBuilder('kpi')
      .leftJoinAndSelect('kpi.venue', 'venue')
      .where('kpi.venue.id = :venueId', { venueId })
      .orderBy('kpi.percentage', 'DESC')
      .limit(limit)
      .getMany();
  }
}
