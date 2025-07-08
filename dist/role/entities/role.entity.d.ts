import { OrganizationUser } from 'src/organization/entities/organizationUser.entity';
import { UserVenueRole } from 'src/users/entities/user-venue-role.entity';
export declare class Role {
    id: number;
    name: string;
    organizationUsers: OrganizationUser[];
    userVenueRoles: UserVenueRole[];
}
