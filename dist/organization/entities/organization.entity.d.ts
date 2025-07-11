import { OrganizationUser } from './organizationUser.entity';
import { Company } from 'src/company/entities/company.entity';
export declare class Organization {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    organizationUsers: OrganizationUser[];
    companies: Company[];
}
