import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { Cost, CostCategory, CostFrequency } from './entities/cost.entity';
export declare class CostsController {
    private readonly costsService;
    constructor(costsService: CostsService);
    create(createCostDto: CreateCostDto, req: any): Promise<Cost>;
    findAll(venueId?: string, category?: CostCategory): Promise<Cost[]>;
    findByVenue(venueId: string): Promise<Cost[]>;
    findByCategory(category: CostCategory): Promise<Cost[]>;
    getUnpaidCosts(venueId?: string): Promise<Cost[]>;
    getTotalCosts(venueId: string, startDate?: string, endDate?: string): Promise<any>;
    findOne(id: string): Promise<Cost>;
    update(id: string, updateCostDto: UpdateCostDto, req: any): Promise<Cost>;
    markAsPaid(id: string, req: any): Promise<Cost>;
    remove(id: string): Promise<void>;
    getCostCategories(): Promise<CostCategory[]>;
    getCostFrequencies(): Promise<CostFrequency[]>;
}
