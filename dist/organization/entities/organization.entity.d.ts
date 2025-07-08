import { Business } from 'src/business/entities/business.entity';
import { OrganizationUser } from './organizationUser.entity';
export declare class Organization {
    id: number;
    name: string;
    organizationUsers: OrganizationUser[];
    businesses: Business[];
}
