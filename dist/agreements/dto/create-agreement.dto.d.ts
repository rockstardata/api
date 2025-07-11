import { AgreementStatus, AgreementType } from '../entities/agreement.entity';
export declare class CreateAgreementDto {
    title: string;
    description?: string;
    type?: AgreementType;
    status?: AgreementStatus;
    startDate: string;
    endDate: string;
    amount?: number;
    terms?: string;
    contractNumber?: string;
    isActive?: boolean;
    venueId: number;
    responsiblePersonId?: number;
}
