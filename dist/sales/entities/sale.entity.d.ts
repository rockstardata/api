import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
export declare enum PaymentMethod {
    CASH = "cash",
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    TRANSFER = "transfer",
    OTHER = "other"
}
export declare enum SaleStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare class Sale {
    id: number;
    productName: string;
    quantity: number;
    price: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    status: SaleStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    ticket: any;
    createdBy: User;
    venue: Venue;
}
