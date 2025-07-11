import { PermissionsService } from './permissions.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    assign(assignPermissionDto: AssignPermissionDto): Promise<import("./entities/user-permission.entity").UserPermission>;
    assignSalesPermissionToOrganization(organizationId: string, userId: string, permissionType?: string): Promise<import("./entities/user-permission.entity").UserPermission>;
    assignSalesPermissionToCompany(companyId: string, userId: string, permissionType?: string): Promise<import("./entities/user-permission.entity").UserPermission>;
    assignSalesPermissionToVenue(venueId: string, userId: string, permissionType?: string): Promise<import("./entities/user-permission.entity").UserPermission>;
    getUserPermissions(userId: string): Promise<import("./entities/user-permission.entity").UserPermission[]>;
    checkPermission(userId: string, permissionType: string, resourceType: string, resourceId: string): Promise<boolean>;
    removePermission(userId: string, permissionType: string, resourceType: string, resourceId: string): Promise<{
        message: string;
    }>;
}
