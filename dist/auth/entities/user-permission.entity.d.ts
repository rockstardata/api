import { User } from 'src/users/entities/user.entity';
import { PermissionType } from '../enums/permission-type.enum';
import { ResourceType } from '../enums/resource-type.enum';
export declare class UserPermission {
    id: number;
    user: User;
    permissionType: PermissionType;
    resourceType: ResourceType;
    resourceId: number;
}
