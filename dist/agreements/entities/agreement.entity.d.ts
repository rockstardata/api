import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
export declare enum AgreementStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    EXPIRED = "expired",
    TERMINATED = "terminated"
}
export declare enum AgreementType {
    VENUE_RENTAL = "venue_rental",
    SERVICE_PROVIDER = "service_provider",
    SUPPLIER = "supplier",
    PARTNERSHIP = "partnership",
    OTHER = "other"
}
export declare class Agreement {
    id: number;
    title: string;
    description: string;
    type: AgreementType;
    status: AgreementStatus;
    startDate: Date;
    endDate: Date;
    amount: number;
    terms: string;
    contractNumber: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    venue: Venue;
    createdBy: User;
    responsiblePerson: User;
}
