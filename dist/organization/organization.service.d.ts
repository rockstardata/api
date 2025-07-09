import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationUser } from './entities/organizationUser.entity';
import { User } from 'src/users/entities/user.entity';
export declare class OrganizationService {
    private readonly organizationRepository;
    private readonly organizationUserRepository;
    private readonly userRepository;
    constructor(organizationRepository: Repository<Organization>, organizationUserRepository: Repository<OrganizationUser>, userRepository: Repository<User>);
    create(createOrganizationDto: CreateOrganizationDto): Promise<Organization>;
    findAll(): Promise<Organization[]>;
    findOne(id: number): Promise<Organization>;
    update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization>;
    remove(id: number): Promise<Organization>;
    assignUserToOrganization(orgId: number, userId: number): Promise<OrganizationUser>;
}
