import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Organization } from './organization.entity';
export declare class OrganizationUser {
    id: number;
    user: User;
    organization: Organization;
    role: Role;
}
