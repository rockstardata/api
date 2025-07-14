import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import { SyncService } from '../database/sync.service';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly syncService: SyncService,
  ) {}

  async create(createBusinessDto: CreateBusinessDto, userId?: number): Promise<Business> {
    const businessData: Partial<Business> = {
      ...createBusinessDto,
    };
    
    if (userId) {
      businessData.createdBy = { id: userId } as any;
    }
    
    const business = this.businessRepository.create(businessData);
    const savedBusiness = await this.businessRepository.save(business);
    
    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Business', 'create', savedBusiness).catch(error => {
      console.error('Failed to sync business creation to external DB:', error);
    });
    
    return savedBusiness;
  }

  async findAll(): Promise<Business[]> {
    return await this.businessRepository.find({
      relations: ['company', 'createdBy'],
    });
  }

  async findOne(id: number): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['company', 'createdBy'],
    });
    
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    
    return business;
  }

  async update(id: number, updateBusinessDto: UpdateBusinessDto): Promise<Business> {
    const business = await this.findOne(id);
    Object.assign(business, updateBusinessDto);
    const updatedBusiness = await this.businessRepository.save(business);
    
    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Business', 'update', updatedBusiness).catch(error => {
      console.error('Failed to sync business update to external DB:', error);
    });
    
    return updatedBusiness;
  }

  async remove(id: number): Promise<void> {
    const business = await this.findOne(id);
    await this.businessRepository.remove(business);
    
    // Sincronizar eliminación con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Business', 'delete', { id }).catch(error => {
      console.error('Failed to sync business deletion to external DB:', error);
    });
  }

  async findByCompany(companyId: number): Promise<Business[]> {
    return await this.businessRepository.find({
      where: { company: { id: companyId } },
      relations: ['company', 'createdBy'],
    });
  }
}
