import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
export declare class BusinessService {
    private readonly businessRepository;
    constructor(businessRepository: Repository<Business>);
    create(createBusinessDto: CreateBusinessDto, userId?: number): Promise<Business>;
    findAll(): Promise<Business[]>;
    findOne(id: number): Promise<Business>;
    update(id: number, updateBusinessDto: UpdateBusinessDto): Promise<Business>;
    remove(id: number): Promise<void>;
    findByOrganization(organizationId: number): Promise<Business[]>;
}
