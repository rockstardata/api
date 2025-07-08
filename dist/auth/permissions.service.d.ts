import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Repository } from 'typeorm';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { UserPermission } from './entities/user-permission.entity';
export declare class PermissionsService {
    private readonly permissionRepository;
    private readonly userRepository;
    private readonly organizationRepository;
    private readonly venueRepository;
    constructor(permissionRepository: Repository<UserPermission>, userRepository: Repository<User>, organizationRepository: Repository<Organization>, venueRepository: Repository<Venue>);
    assign(assignPermissionDto: AssignPermissionDto): Promise<UserPermission>;
}
