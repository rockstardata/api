import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import { SyncService } from '../database/sync.service';
export declare class BusinessService {
    private readonly businessRepository;
    private readonly syncService;
    constructor(businessRepository: Repository<Business>, syncService: SyncService);
    create(createBusinessDto: CreateBusinessDto, userId?: number): Promise<Business>;
    findAll(): Promise<Business[]>;
    findOne(id: number): Promise<Business>;
    update(id: number, updateBusinessDto: UpdateBusinessDto): Promise<Business>;
    remove(id: number): Promise<void>;
    findByCompany(companyId: number): Promise<Business[]>;
}
