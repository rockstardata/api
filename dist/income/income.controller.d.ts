import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income, IncomeCategory, IncomeStatus } from './entities/income.entity';
export declare class IncomeController {
    private readonly incomeService;
    constructor(incomeService: IncomeService);
    create(createIncomeDto: CreateIncomeDto, req: any): Promise<Income>;
    findAll(venueId?: string, category?: IncomeCategory): Promise<Income[]>;
    findByVenue(venueId: string): Promise<Income[]>;
    findByCategory(category: IncomeCategory): Promise<Income[]>;
    findByStatus(status: IncomeStatus): Promise<Income[]>;
    getPendingIncome(venueId?: string): Promise<Income[]>;
    getTotalIncome(venueId: string, startDate?: string, endDate?: string): Promise<any>;
    findOne(id: string): Promise<Income>;
    update(id: string, updateIncomeDto: UpdateIncomeDto, req: any): Promise<Income>;
    markAsReceived(id: string, req: any): Promise<Income>;
    remove(id: string): Promise<void>;
    getIncomeCategories(): Promise<IncomeCategory[]>;
    getIncomeStatuses(): Promise<IncomeStatus[]>;
}
