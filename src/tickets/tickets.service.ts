import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//import { Sale } from 'src/sales/entities/sale.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { venueId, sales, ...ticketData } = createTicketDto;

    const venue = await this.venueRepository.findOneBy({ id: venueId });
    if (!venue) {
      throw new NotFoundException(`Venue with ID "${venueId}" not found`);
    }

    const ticket = this.ticketRepository.create({
      ...ticketData,
      venue,
      sales: sales, // TypeORM creará las entidades Sale a partir de los objetos
    });

    // Al guardar el ticket, las ventas se guardarán automáticamente por la cascada
    return this.ticketRepository.save(ticket);
  }

  findAll() {
    return this.ticketRepository.find({
      relations: ['venue', 'sales'],
    });
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['venue', 'sales'],
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${id}" not found`);
    }
    return ticket;
  }
}
