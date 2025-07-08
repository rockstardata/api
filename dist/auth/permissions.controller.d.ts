import { AssignPermissionDto } from './dto/assign-permission.dto';
import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    assignPermission(assignPermissionDto: AssignPermissionDto): Promise<import("./entities/user-permission.entity").UserPermission>;
}
