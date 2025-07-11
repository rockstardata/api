import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { Cost, CostCategory } from './entities/cost.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Injectable()
export class CostsService {
  constructor(
    @InjectRepository(Cost)
    private costRepository: Repository<Cost>,
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly syncService: SyncService,
  ) {}

  async create(createCostDto: CreateCostDto, userId: number) {
    const venue = await this.venueRepository.findOne({
      where: { id: createCostDto.venueId },
    });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    const cost = this.costRepository.create({
      ...createCostDto,
      venue,
      createdBy: { id: userId },
      date: new Date(createCostDto.date),
      dueDate: createCostDto.dueDate ? new Date(createCostDto.dueDate) : null,
    });

    if (createCostDto.approvedById) {
      const approvedBy = await this.userRepository.findOne({
        where: { id: createCostDto.approvedById },
      });
      if (approvedBy) {
        cost.approvedBy = approvedBy;
      }
    }

    const savedCost = await this.costRepository.save(cost);
    this.syncService.syncEntity('Cost', 'create', savedCost).catch(error => {
      console.error('Failed to sync cost creation to external DB:', error);
    });
    return savedCost;
  }

  async findAll(venueId?: number, category?: string) {
    const query = this.costRepository.createQueryBuilder('cost')
      .leftJoinAndSelect('cost.venue', 'venue')
      .leftJoinAndSelect('cost.createdBy', 'createdBy')
      .leftJoinAndSelect('cost.approvedBy', 'approvedBy');

    if (venueId) {
      query.where('venue.id = :venueId', { venueId });
    }

    if (category) {
      query.andWhere('cost.category = :category', { category });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const cost = await this.costRepository.findOne({
      where: { id },
      relations: ['venue', 'createdBy', 'approvedBy'],
    });

    if (!cost) {
      throw new NotFoundException(`Cost with ID ${id} not found`);
    }

    return cost;
  }

  async update(id: number, updateCostDto: UpdateCostDto, userId: number) {
    const cost = await this.findOne(id);

    if (updateCostDto.venueId) {
      const venue = await this.venueRepository.findOne({
        where: { id: updateCostDto.venueId },
      });
      if (venue) {
        cost.venue = venue;
      }
    }

    if (updateCostDto.approvedById) {
      const approvedBy = await this.userRepository.findOne({
        where: { id: updateCostDto.approvedById },
      });
      if (approvedBy) {
        cost.approvedBy = approvedBy;
      }
    }

    if (updateCostDto.date) {
      cost.date = new Date(updateCostDto.date);
    }

    if (updateCostDto.dueDate) {
      cost.dueDate = new Date(updateCostDto.dueDate);
    }

    Object.assign(cost, updateCostDto);
    const updatedCost = await this.costRepository.save(cost);
    this.syncService.syncEntity('Cost', 'update', updatedCost).catch(error => {
      console.error('Failed to sync cost update to external DB:', error);
    });
    return updatedCost;
  }

  async remove(id: number) {
    const cost = await this.findOne(id);
    await this.costRepository.remove(cost);
    this.syncService.syncEntity('Cost', 'delete', { id }).catch(error => {
      console.error('Failed to sync cost deletion to external DB:', error);
    });
  }

  async findByVenue(venueId: number) {
    return this.costRepository.find({
      where: { venue: { id: venueId } },
      relations: ['venue', 'createdBy', 'approvedBy'],
    });
  }

  async findByCategory(category: CostCategory) {
    return this.costRepository.find({
      where: { category },
      relations: ['venue'],
    });
  }

  async getTotalCostsByVenue(venueId: number, startDate?: Date, endDate?: Date) {
    const query = this.costRepository
      .createQueryBuilder('cost')
      .select('SUM(cost.amount)', 'total')
      .where('cost.venue.id = :venueId', { venueId });

    if (startDate && endDate) {
      query.andWhere('cost.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const result = await query.getRawOne();
    return result?.total || 0;
  }

  async getUnpaidCosts(venueId?: number) {
    const query = this.costRepository
      .createQueryBuilder('cost')
      .leftJoinAndSelect('cost.venue', 'venue')
      .where('cost.isPaid = :isPaid', { isPaid: false });

    if (venueId) {
      query.andWhere('venue.id = :venueId', { venueId });
    }

    return query.getMany();
  }

  async markAsPaid(id: number, userId: number) {
    const cost = await this.findOne(id);
    cost.isPaid = true;
    cost.approvedBy = { id: userId } as User;
    return this.costRepository.save(cost);
  }
}
