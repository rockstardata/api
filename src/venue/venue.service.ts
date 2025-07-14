import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { Venue } from './entities/venue.entity';
import { SyncService } from '../database/sync.service';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    private readonly syncService: SyncService,
  ) {}

  async create(createVenueDto: CreateVenueDto): Promise<Venue> {
    const venue = this.venueRepository.create(createVenueDto);
    const savedVenue = await this.venueRepository.save(venue);
    
    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Venue', 'create', savedVenue).catch((error) => {
      console.error('Failed to sync venue creation to external DB:', error);
    });
    
    return savedVenue;
  }

  async findAll(): Promise<Venue[]> {
    return await this.venueRepository.find({
      relations: ['company'],
    });
  }

  async findOne(id: number): Promise<Venue> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    
    return venue;
  }

  async update(id: number, updateVenueDto: UpdateVenueDto): Promise<Venue> {
    const venue = await this.findOne(id);
    Object.assign(venue, updateVenueDto);
    const updatedVenue = await this.venueRepository.save(venue);
    
    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Venue', 'update', updatedVenue).catch((error) => {
      console.error('Failed to sync venue update to external DB:', error);
    });
    
    return updatedVenue;
  }

  async remove(id: number): Promise<void> {
    const venue = await this.findOne(id);
    await this.venueRepository.remove(venue);
    
    // Sincronizar eliminación con base de datos externa de forma asíncrona
    this.syncService.syncEntity('Venue', 'delete', { id }).catch((error) => {
      console.error('Failed to sync venue deletion to external DB:', error);
    });
  }

  async findByCompany(companyId: number): Promise<Venue[]> {
    return await this.venueRepository.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
  }
}
