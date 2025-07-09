import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto, userId?: number): Promise<Business> {
    const businessData: Partial<Business> = {
      ...createBusinessDto,
    };
    
    if (userId) {
      businessData.createdBy = { id: userId } as any;
    }
    
    const business = this.businessRepository.create(businessData);
    return await this.businessRepository.save(business);
  }

  async findAll(): Promise<Business[]> {
    return await this.businessRepository.find({
      relations: ['organization', 'createdBy', 'staffMembers', 'venues'],
    });
  }

  async findOne(id: number): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['organization', 'createdBy', 'staffMembers', 'venues'],
    });
    
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    
    return business;
  }

  async update(id: number, updateBusinessDto: UpdateBusinessDto): Promise<Business> {
    const business = await this.findOne(id);
    Object.assign(business, updateBusinessDto);
    return await this.businessRepository.save(business);
  }

  async remove(id: number): Promise<void> {
    const business = await this.findOne(id);
    await this.businessRepository.remove(business);
  }

  async findByOrganization(organizationId: number): Promise<Business[]> {
    return await this.businessRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['organization', 'createdBy', 'staffMembers', 'venues'],
    });
  }
}
