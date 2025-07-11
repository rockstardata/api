import { KpiType, KpiPeriod } from '../entities/kpi.entity';
export declare class CreateKpiDto {
    name: string;
    description?: string;
    type?: KpiType;
    period?: KpiPeriod;
    targetValue: number;
    actualValue?: number;
    percentage?: number;
    startDate: string;
    endDate: string;
    unit?: string;
    isActive?: boolean;
    venueId: number;
    responsiblePersonId?: number;
}
