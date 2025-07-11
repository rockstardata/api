import { Repository } from 'typeorm';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { Cost, CostCategory } from './entities/cost.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';
export declare class CostsService {
    private costRepository;
    private venueRepository;
    private userRepository;
    private readonly syncService;
    constructor(costRepository: Repository<Cost>, venueRepository: Repository<Venue>, userRepository: Repository<User>, syncService: SyncService);
    create(createCostDto: CreateCostDto, userId: number): Promise<Cost>;
    findAll(venueId?: number, category?: string): Promise<Cost[]>;
    findOne(id: number): Promise<Cost>;
    update(id: number, updateCostDto: UpdateCostDto, userId: number): Promise<Cost>;
    remove(id: number): Promise<void>;
    findByVenue(venueId: number): Promise<Cost[]>;
    findByCategory(category: CostCategory): Promise<Cost[]>;
    getTotalCostsByVenue(venueId: number, startDate?: Date, endDate?: Date): Promise<any>;
    getUnpaidCosts(venueId?: number): Promise<Cost[]>;
    markAsPaid(id: number, userId: number): Promise<Cost>;
}
