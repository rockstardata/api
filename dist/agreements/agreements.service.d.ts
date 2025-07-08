import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
export declare class AgreementsService {
    create(createAgreementDto: CreateAgreementDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAgreementDto: UpdateAgreementDto): string;
    remove(id: number): string;
}
