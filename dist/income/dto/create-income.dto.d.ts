import { IncomeCategory, IncomeStatus } from '../entities/income.entity';
export declare class CreateIncomeDto {
    name: string;
    description?: string;
    amount: number;
    category?: IncomeCategory;
    status?: IncomeStatus;
    date: string;
    dueDate?: string;
    invoiceNumber?: string;
    customer?: string;
    paymentMethod?: string;
    isActive?: boolean;
    venueId: number;
    saleId?: number;
    receivedById?: number;
}
