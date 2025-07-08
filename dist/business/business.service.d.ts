import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
export declare class BusinessService {
    create(createBusinessDto: CreateBusinessDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateBusinessDto: UpdateBusinessDto): string;
    remove(id: number): string;
}
