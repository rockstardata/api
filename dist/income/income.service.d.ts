import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income, IncomeCategory, IncomeStatus } from './entities/income.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';
export declare class IncomeService {
    private incomeRepository;
    private venueRepository;
    private saleRepository;
    private userRepository;
    private readonly syncService;
    constructor(incomeRepository: Repository<Income>, venueRepository: Repository<Venue>, saleRepository: Repository<Sale>, userRepository: Repository<User>, syncService: SyncService);
    create(createIncomeDto: CreateIncomeDto, userId: number): Promise<Income>;
    findAll(venueId?: number, category?: string): Promise<Income[]>;
    findOne(id: number): Promise<Income>;
    update(id: number, updateIncomeDto: UpdateIncomeDto, userId: number): Promise<Income>;
    remove(id: number): Promise<void>;
    findByVenue(venueId: number): Promise<Income[]>;
    findByCategory(category: IncomeCategory): Promise<Income[]>;
    findByStatus(status: IncomeStatus): Promise<Income[]>;
    getTotalIncomeByVenue(venueId: number, startDate?: Date, endDate?: Date): Promise<any>;
    getPendingIncome(venueId?: number): Promise<Income[]>;
    markAsReceived(id: number, userId: number): Promise<Income>;
}
