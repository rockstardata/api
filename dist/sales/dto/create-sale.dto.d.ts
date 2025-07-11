import { PaymentMethod, SaleStatus } from '../entities/sale.entity';
export declare class CreateSaleDto {
    productName: string;
    quantity: number;
    price: number;
    totalAmount: number;
    paymentMethod?: PaymentMethod;
    status?: SaleStatus;
    notes?: string;
    ticketId?: number;
    venueId?: number;
}
