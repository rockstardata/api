import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
export declare enum CostCategory {
    RENT = "rent",
    UTILITIES = "utilities",
    SALARY = "salary",
    SUPPLIES = "supplies",
    MAINTENANCE = "maintenance",
    MARKETING = "marketing",
    INSURANCE = "insurance",
    TAXES = "taxes",
    OTHER = "other"
}
export declare enum CostFrequency {
    ONE_TIME = "one_time",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export declare class Cost {
    id: number;
    name: string;
    description: string;
    amount: number;
    category: CostCategory;
    frequency: CostFrequency;
    date: Date;
    dueDate: Date | null;
    isPaid: boolean;
    invoiceNumber: string;
    vendor: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    venue: Venue;
    createdBy: User;
    approvedBy: User;
}
