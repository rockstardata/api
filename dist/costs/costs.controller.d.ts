import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
export declare class CostsController {
    private readonly costsService;
    constructor(costsService: CostsService);
    create(createCostDto: CreateCostDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCostDto: UpdateCostDto): string;
    remove(id: string): string;
}
