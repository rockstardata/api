import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PermissionsService } from 'src/auth/permissions.service';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Business } from 'src/business/entities/business.entity';
export declare class SalesService {
    private readonly saleRepository;
    private readonly ticketRepository;
    private readonly venueRepository;
    private readonly businessRepository;
    private readonly permissionsService;
    constructor(saleRepository: Repository<Sale>, ticketRepository: Repository<Ticket>, venueRepository: Repository<Venue>, businessRepository: Repository<Business>, permissionsService: PermissionsService);
    create(createSaleDto: CreateSaleDto, userId?: number): Promise<Sale>;
    findAll(userId?: number): Promise<Sale[]>;
    findOne(id: number, userId?: number): Promise<Sale>;
    update(id: number, updateSaleDto: UpdateSaleDto, userId?: number): Promise<Sale>;
    remove(id: number, userId?: number): Promise<void>;
    findByBusiness(businessId: number, userId?: number): Promise<Sale[]>;
    findByVenue(venueId: number, userId?: number): Promise<Sale[]>;
    findByUser(userId: number): Promise<Sale[]>;
    getSalesSummary(businessId?: number, venueId?: number, userId?: number): Promise<any>;
    private canAccessSale;
    private hasUpdatePermission;
    private hasDeletePermission;
}
