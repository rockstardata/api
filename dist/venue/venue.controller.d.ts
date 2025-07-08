import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
export declare class VenueController {
    private readonly venueService;
    constructor(venueService: VenueService);
    create(createVenueDto: CreateVenueDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateVenueDto: UpdateVenueDto): string;
    remove(id: string): string;
}
