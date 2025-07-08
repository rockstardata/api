import { Ticket } from 'src/tickets/entities/ticket.entity';
export declare class Sale {
    id: number;
    productName: string;
    quantity: number;
    price: number;
    ticket: Ticket;
}
