import { KpisService } from './kpis.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { Kpi, KpiType, KpiPeriod } from './entities/kpi.entity';
export declare class KpisController {
    private readonly kpisService;
    constructor(kpisService: KpisService);
    create(createKpiDto: CreateKpiDto, req: any): Promise<Kpi>;
    findAll(venueId?: string, type?: KpiType): Promise<Kpi[]>;
    findByVenue(venueId: string): Promise<Kpi[]>;
    findByType(type: KpiType): Promise<Kpi[]>;
    findByPeriod(period: KpiPeriod): Promise<Kpi[]>;
    getOverdueKpis(venueId?: string): Promise<Kpi[]>;
    getKpiPerformance(venueId: string, type?: KpiType): Promise<any[]>;
    getTopPerformers(venueId: string, limit?: string): Promise<Kpi[]>;
    findOne(id: string): Promise<Kpi>;
    update(id: string, updateKpiDto: UpdateKpiDto, req: any): Promise<Kpi>;
    updateActualValue(id: string, actualValue: number): Promise<Kpi>;
    remove(id: string): Promise<void>;
    getKpiTypes(): Promise<KpiType[]>;
    getKpiPeriods(): Promise<KpiPeriod[]>;
}
