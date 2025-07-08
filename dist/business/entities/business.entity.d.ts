import { Organization } from 'src/organization/entities/organization.entity';
import { StaffMember } from 'src/staff-member/entities/staff-member.entity';
import { Venue } from 'src/venue/entities/venue.entity';
export declare class Business {
    id: number;
    name: string;
    organization: Organization;
    staffMembers: StaffMember[];
    venues: Venue[];
}
