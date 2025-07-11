import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<import("./entities/sale.entity").Sale>;
    findAll(): Promise<import("./entities/sale.entity").Sale[]>;
    getSalesSummary(venueId?: string): Promise<any>;
    findByVenue(venueId: string): Promise<import("./entities/sale.entity").Sale[]>;
    findByUser(userId: string): Promise<import("./entities/sale.entity").Sale[]>;
    findOne(id: string): Promise<import("./entities/sale.entity").Sale>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<import("./entities/sale.entity").Sale>;
    remove(id: string): Promise<void>;
}
