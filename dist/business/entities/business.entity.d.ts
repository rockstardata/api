import { Organization } from 'src/organization/entities/organization.entity';
import { StaffMember } from 'src/staff-member/entities/staff-member.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Business {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    organization: Organization;
    createdBy: User;
    staffMembers: StaffMember[];
    venues: Venue[];
}
