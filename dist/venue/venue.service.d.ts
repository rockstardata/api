import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
export declare class VenueService {
    create(createVenueDto: CreateVenueDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateVenueDto: UpdateVenueDto): string;
    remove(id: number): string;
}
