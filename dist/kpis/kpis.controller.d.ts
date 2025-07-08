import { KpisService } from './kpis.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
export declare class KpisController {
    private readonly kpisService;
    constructor(kpisService: KpisService);
    create(createKpiDto: CreateKpiDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateKpiDto: UpdateKpiDto): string;
    remove(id: string): string;
}
