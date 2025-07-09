import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    create(createOrganizationDto: CreateOrganizationDto): Promise<import("./entities/organization.entity").Organization>;
    findAll(): Promise<import("./entities/organization.entity").Organization[]>;
    findOne(id: number): Promise<import("./entities/organization.entity").Organization>;
    update(id: number, updateOrganizationDto: UpdateOrganizationDto): Promise<import("./entities/organization.entity").Organization>;
    remove(id: number): Promise<import("./entities/organization.entity").Organization>;
    assignUserToOrganization(orgId: number, userId: number): Promise<import("./entities/organizationUser.entity").OrganizationUser>;
}
