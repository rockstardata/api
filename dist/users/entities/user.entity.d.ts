import { OrganizationUser } from 'src/organization/entities/organizationUser.entity';
import { UserVenueRole } from './user-venue-role.entity';
import { UserPermission } from 'src/auth/entities/user-permission.entity';
import { UserPermissionLevel } from './user-permission-level.entity';
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationUsers: OrganizationUser[];
    userVenueRoles: UserVenueRole[];
    permissions: UserPermission[];
    permissionLevels: UserPermissionLevel[];
}
