import { Repository } from 'typeorm';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { Kpi, KpiType, KpiPeriod } from './entities/kpi.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';
export declare class KpisService {
    private kpiRepository;
    private venueRepository;
    private userRepository;
    private readonly syncService;
    constructor(kpiRepository: Repository<Kpi>, venueRepository: Repository<Venue>, userRepository: Repository<User>, syncService: SyncService);
    create(createKpiDto: CreateKpiDto, userId: number): Promise<Kpi>;
    findAll(venueId?: number, type?: string): Promise<Kpi[]>;
    findOne(id: number): Promise<Kpi>;
    update(id: number, updateKpiDto: UpdateKpiDto, userId: number): Promise<Kpi>;
    remove(id: number): Promise<void>;
    findByVenue(venueId: number): Promise<Kpi[]>;
    findByType(type: KpiType): Promise<Kpi[]>;
    findByPeriod(period: KpiPeriod): Promise<Kpi[]>;
    updateActualValue(id: number, actualValue: number): Promise<Kpi>;
    getKpiPerformance(venueId: number, type?: string): Promise<any[]>;
    getOverdueKpis(venueId?: number): Promise<Kpi[]>;
    getTopPerformers(venueId: number, limit?: number): Promise<Kpi[]>;
}
