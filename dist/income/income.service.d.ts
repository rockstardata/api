import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
export declare class IncomeService {
    create(createIncomeDto: CreateIncomeDto): string;
    findByOrganization(orgId: number): {
        message: string;
    };
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateIncomeDto: UpdateIncomeDto): string;
    remove(id: number): string;
}
