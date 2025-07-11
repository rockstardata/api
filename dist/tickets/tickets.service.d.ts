import { Venue } from 'src/venue/entities/venue.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { SyncService } from '../database/sync.service';
export declare class TicketsService {
    private readonly ticketRepository;
    private readonly venueRepository;
    private readonly syncService;
    constructor(ticketRepository: Repository<Ticket>, venueRepository: Repository<Venue>, syncService: SyncService);
    create(createTicketDto: CreateTicketDto): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findOne(id: number): Promise<Ticket>;
}
