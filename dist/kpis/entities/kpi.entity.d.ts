import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
export declare enum KpiType {
    REVENUE = "revenue",
    ATTENDANCE = "attendance",
    CONVERSION_RATE = "conversion_rate",
    CUSTOMER_SATISFACTION = "customer_satisfaction",
    OPERATIONAL_EFFICIENCY = "operational_efficiency",
    COST_PER_ATTENDEE = "cost_per_attendee",
    PROFIT_MARGIN = "profit_margin",
    OTHER = "other"
}
export declare enum KpiPeriod {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export declare class Kpi {
    id: number;
    name: string;
    description: string;
    type: KpiType;
    period: KpiPeriod;
    targetValue: number;
    actualValue: number;
    percentage: number;
    startDate: Date;
    endDate: Date;
    unit: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    venue: Venue;
    createdBy: User;
    responsiblePerson: User;
}
