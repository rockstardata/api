import { AgreementsService } from './agreements.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { Agreement, AgreementStatus, AgreementType } from './entities/agreement.entity';
export declare class AgreementsController {
    private readonly agreementsService;
    constructor(agreementsService: AgreementsService);
    create(createAgreementDto: CreateAgreementDto, req: any): Promise<Agreement>;
    findAll(venueId?: string): Promise<Agreement[]>;
    findByVenue(venueId: string): Promise<Agreement[]>;
    findByStatus(status: AgreementStatus): Promise<Agreement[]>;
    getExpiringAgreements(days?: string): Promise<Agreement[]>;
    findOne(id: string): Promise<Agreement>;
    update(id: string, updateAgreementDto: UpdateAgreementDto, req: any): Promise<Agreement>;
    remove(id: string): Promise<void>;
    getAgreementTypes(): Promise<AgreementType[]>;
    getAgreementStatuses(): Promise<AgreementStatus[]>;
}
