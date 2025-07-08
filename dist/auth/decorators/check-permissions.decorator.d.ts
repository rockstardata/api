import { PermissionType } from '../enums/permission-type.enum';
import { ResourceType } from 'src/auth/enums/resource-type.enum';
export declare const PERMISSIONS_KEY = "permissions";
export declare const CheckPermissions: (permission: PermissionType, resource: ResourceType, resourceIdParam?: string) => import("@nestjs/common").CustomDecorator<string>;
