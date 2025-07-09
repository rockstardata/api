import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Business } from 'src/business/entities/business.entity';
import { Repository } from 'typeorm';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { UserPermission } from './entities/user-permission.entity';
import { ResourceType } from './enums/resource-type.enum';
import { PermissionType } from './enums/permission-type.enum';
export declare class PermissionsService {
    private readonly permissionRepository;
    private readonly userRepository;
    private readonly organizationRepository;
    private readonly venueRepository;
    private readonly businessRepository;
    constructor(permissionRepository: Repository<UserPermission>, userRepository: Repository<User>, organizationRepository: Repository<Organization>, venueRepository: Repository<Venue>, businessRepository: Repository<Business>);
    assign(assignPermissionDto: AssignPermissionDto): Promise<UserPermission>;
    assignSalesPermissionToOrganization(userId: number, organizationId: number, permissionType?: PermissionType): Promise<UserPermission>;
    assignSalesPermissionToBusiness(userId: number, businessId: number, permissionType?: PermissionType): Promise<UserPermission>;
    assignSalesPermissionToVenue(userId: number, venueId: number, permissionType?: PermissionType): Promise<UserPermission>;
    getUserPermissions(userId: number): Promise<UserPermission[]>;
    hasPermission(userId: number, permissionType: PermissionType, resourceType: ResourceType, resourceId: number): Promise<boolean>;
    removePermission(userId: number, permissionType: PermissionType, resourceType: ResourceType, resourceId: number): Promise<{
        message: string;
    }>;
}
