import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
export declare class CostsService {
    create(createCostDto: CreateCostDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCostDto: UpdateCostDto): string;
    remove(id: number): string;
}
