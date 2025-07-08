import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
export declare class KpisService {
    create(createKpiDto: CreateKpiDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateKpiDto: UpdateKpiDto): string;
    remove(id: number): string;
}
