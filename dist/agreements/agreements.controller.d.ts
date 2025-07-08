import { AgreementsService } from './agreements.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
export declare class AgreementsController {
    private readonly agreementsService;
    constructor(agreementsService: AgreementsService);
    create(createAgreementDto: CreateAgreementDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAgreementDto: UpdateAgreementDto): string;
    remove(id: string): string;
}
