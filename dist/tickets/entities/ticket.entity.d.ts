import { Sale } from 'src/sales/entities/sale.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { Business } from 'src/business/entities/business.entity';
export declare enum TicketStatus {
    PENDING = "pending",
    PAID = "paid",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare class Ticket {
    id: number;
    totalAmount: number;
    status: TicketStatus;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    venue: Venue;
    createdBy: User;
    business: Business;
    sales: Sale[];
}
