import { Sale } from 'src/sales/entities/sale.entity';
import { Venue } from 'src/venue/entities/venue.entity';
export declare class Ticket {
    id: number;
    totalAmount: number;
    createdAt: Date;
    venue: Venue;
    sales: Sale[];
}
