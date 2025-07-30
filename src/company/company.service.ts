import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SyncService } from '../database/sync.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly syncService: SyncService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    userId?: number,
  ): Promise<Company> {
    const companyData: Partial<Company> = {
      ...createCompanyDto,
    };

    if (userId) {
      companyData.createdBy = { id: userId } as any;
    }

    const company = this.companyRepository.create(companyData);
    const savedCompany = await this.companyRepository.save(company);

    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService
      .syncEntity('Company', 'create', savedCompany)
      .catch((error) => {
        console.error('Failed to sync company creation to external DB:', error);
      });

    return savedCompany;
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find({
      relations: ['organization', 'createdBy', 'venues'],
    });
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['organization', 'createdBy', 'venues'],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, updateCompanyDto);
    const updatedCompany = await this.companyRepository.save(company);

    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService
      .syncEntity('Company', 'update', updatedCompany)
      .catch((error) => {
        console.error('Failed to sync company update to external DB:', error);
      });

    return updatedCompany;
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company);

    // Sincronizar eliminación con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Company', 'delete', { id }).catch((error) => {
      console.error('Failed to sync company deletion to external DB:', error);
    });
  }

  async findByOrganization(organizationId: number): Promise<Company[]> {
    return await this.companyRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['organization', 'createdBy', 'venues'],
    });
  }
}
