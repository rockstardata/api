import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    create(createBusinessDto: CreateBusinessDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateBusinessDto: UpdateBusinessDto): string;
    remove(id: string): string;
}
