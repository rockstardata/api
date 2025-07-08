import { Venue } from 'src/venue/entities/venue.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './entities/ticket.entity';
export declare class TicketsService {
    private readonly ticketRepository;
    private readonly venueRepository;
    constructor(ticketRepository: Repository<Ticket>, venueRepository: Repository<Venue>);
    create(createTicketDto: CreateTicketDto): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findOne(id: number): Promise<Ticket>;
}
