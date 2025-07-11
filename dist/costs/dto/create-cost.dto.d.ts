import { CostCategory, CostFrequency } from '../entities/cost.entity';
export declare class CreateCostDto {
    name: string;
    description?: string;
    amount: number;
    category?: CostCategory;
    frequency?: CostFrequency;
    date: string;
    dueDate?: string;
    isPaid?: boolean;
    invoiceNumber?: string;
    vendor?: string;
    isActive?: boolean;
    venueId: number;
    approvedById?: number;
}
