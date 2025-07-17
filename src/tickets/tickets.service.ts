import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from 'src/venue/entities/venue.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { SyncService } from '../database/sync.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    private readonly syncService: SyncService,
  ) {}

  async create(createTicketDto: any): Promise<any> {
    const { venueId, sales, ...ticketData } = createTicketDto;
    // Crear ticket solo con ticketData
    const ticket = this.ticketRepository.create({ ...ticketData });
    const savedTicket = await this.ticketRepository.save(ticket);
    this.syncService
      .syncEntity('Ticket', 'create', savedTicket)
      .catch((error) => {
        console.error('Failed to sync ticket creation to external DB:', error);
      });
    return savedTicket;
  }

  findAll() {
    return this.ticketRepository.find();
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${id}" not found`);
    }
    return ticket;
  }
}
