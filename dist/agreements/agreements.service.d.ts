import { Repository } from 'typeorm';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { Agreement, AgreementStatus } from './entities/agreement.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';
export declare class AgreementsService {
    private agreementRepository;
    private venueRepository;
    private userRepository;
    private readonly syncService;
    constructor(agreementRepository: Repository<Agreement>, venueRepository: Repository<Venue>, userRepository: Repository<User>, syncService: SyncService);
    create(createAgreementDto: CreateAgreementDto, userId: number): Promise<Agreement>;
    findAll(venueId?: number): Promise<Agreement[]>;
    findOne(id: number): Promise<Agreement>;
    update(id: number, updateAgreementDto: UpdateAgreementDto, userId: number): Promise<Agreement>;
    remove(id: number): Promise<void>;
    findByVenue(venueId: number): Promise<Agreement[]>;
    findByStatus(status: AgreementStatus): Promise<Agreement[]>;
    getExpiringAgreements(days?: number): Promise<Agreement[]>;
}
