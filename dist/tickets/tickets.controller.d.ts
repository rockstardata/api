import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(createTicketDto: CreateTicketDto): Promise<import("./entities/ticket.entity").Ticket>;
    findAll(): Promise<import("./entities/ticket.entity").Ticket[]>;
    findOne(id: number): Promise<import("./entities/ticket.entity").Ticket>;
}
