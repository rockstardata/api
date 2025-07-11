import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Sale } from 'src/sales/entities/sale.entity';
export declare enum IncomeCategory {
    TICKET_SALES = "ticket_sales",
    FOOD_BEVERAGE = "food_beverage",
    MERCHANDISE = "merchandise",
    SPONSORSHIP = "sponsorship",
    ADVERTISING = "advertising",
    RENTAL = "rental",
    SERVICES = "services",
    OTHER = "other"
}
export declare enum IncomeStatus {
    PENDING = "pending",
    RECEIVED = "received",
    OVERDUE = "overdue",
    CANCELLED = "cancelled"
}
export declare class Income {
    id: number;
    name: string;
    description: string;
    amount: number;
    category: IncomeCategory;
    status: IncomeStatus;
    date: Date;
    dueDate: Date | null;
    invoiceNumber: string;
    customer: string;
    paymentMethod: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    venue: Venue;
    sale: Sale;
    createdBy: User;
    receivedBy: User;
}
