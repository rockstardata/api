import { PermissionType } from '../enums/permission-type.enum';
import { ResourceType } from '../enums/resource-type.enum';
export declare class AssignPermissionDto {
    userId: number;
    permissionType: PermissionType;
    resourceType: ResourceType;
    resourceId: number;
}
