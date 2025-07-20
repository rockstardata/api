import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Company } from 'src/company/entities/company.entity';
import { Repository } from 'typeorm';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { UserPermission } from './entities/user-permission.entity';
import { ResourceType } from './enums/resource-type.enum';
import { PermissionType } from './enums/permission-type.enum';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly permissionRepository: Repository<UserPermission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async assign(assignPermissionDto: AssignPermissionDto) {
    const { userId, resourceId, resourceType } = assignPermissionDto;

    // Validar que el usuario y el recurso existen
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    if (resourceType === ResourceType.Organization) {
      const org = await this.organizationRepository.findOneBy({
        id: resourceId,
      });
      if (!org)
        throw new NotFoundException(
          `Organization with ID ${resourceId} not found`,
        );
    } else if (resourceType === ResourceType.Company) {
      const company = await this.companyRepository.findOneBy({ id: resourceId });
      if (!company)
        throw new NotFoundException(`Company with ID ${resourceId} not found`);
    } else if (resourceType === ResourceType.Venue) {
      const venue = await this.venueRepository.findOneBy({ id: resourceId });
      if (!venue)
        throw new NotFoundException(`Venue with ID ${resourceId} not found`);
    }

    const existingPermission = await this.permissionRepository.findOneBy({
      user: { id: userId },
      permissionType: assignPermissionDto.permissionType,
      resourceType: resourceType,
      resourceId: resourceId,
    });
    if (existingPermission) {
      throw new BadRequestException(
        'Permission already exists for this user and resource.',
      );
    }

    const permission = this.permissionRepository.create({
      ...assignPermissionDto,
      user: { id: userId },
    });
    return this.permissionRepository.save(permission);
  }

  async assignSalesPermissionToOrganization(
    userId: number,
    organizationId: number,
    permissionType: PermissionType = PermissionType.ViewSales,
  ) {
    return this.assign({
      userId,
      resourceId: organizationId,
      resourceType: ResourceType.Organization,
      permissionType,
    });
  }

  async assignSalesPermissionToCompany(
    userId: number,
    companyId: number,
    permissionType: PermissionType = PermissionType.ViewSales,
  ) {
    return this.assign({
      userId,
      resourceId: companyId,
      resourceType: ResourceType.Company,
      permissionType,
    });
  }

  async assignSalesPermissionToVenue(
    userId: number,
    venueId: number,
    permissionType: PermissionType = PermissionType.ViewSales,
  ) {
    return this.assign({
      userId,
      resourceId: venueId,
      resourceType: ResourceType.Venue,
      permissionType,
    });
  }

  async getUserPermissions(userId: number): Promise<UserPermission[]> {
    return await this.permissionRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async hasPermission(
    userId: number,
    permissionType: PermissionType,
    resourceType: ResourceType,
    resourceId: number,
  ): Promise<boolean> {
    const permission = await this.permissionRepository.findOneBy({
      user: { id: userId },
      permissionType,
      resourceType,
      resourceId,
    });
    return !!permission;
  }

  async removePermission(
    userId: number,
    permissionType: PermissionType,
    resourceType: ResourceType,
    resourceId: number,
  ) {
    const permission = await this.permissionRepository.findOneBy({
      user: { id: userId },
      permissionType,
      resourceType,
      resourceId,
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.permissionRepository.remove(permission);
    return { message: 'Permission removed successfully' };
  }

  async assignRolePermissions(
    userId: number,
    roleName: string,
    resourceType: ResourceType,
    resourceId: number,
  ) {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verificar que el recurso existe
    await this.validateResource(resourceType, resourceId);

    // Definir permisos por rol
    const rolePermissions = this.getRolePermissions(roleName);
    
    const results: Array<{
      permissionType: PermissionType;
      success: boolean;
      data?: UserPermission;
      error?: string;
    }> = [];
    
    for (const permissionType of rolePermissions) {
      try {
        const result = await this.assign({
          userId,
          permissionType,
          resourceType,
          resourceId,
        });
        results.push({ permissionType, success: true, data: result });
      } catch (error) {
        if (error instanceof BadRequestException && error.message.includes('already exists')) {
          results.push({ permissionType, success: false, error: 'Permission already exists' });
        } else {
          results.push({ permissionType, success: false, error: error.message });
        }
      }
    }

    return {
      message: `Role permissions assigned for user ${userId}`,
      roleName,
      resourceType,
      resourceId,
      results,
    };
  }

  private getRolePermissions(roleName: string): PermissionType[] {
    const rolePermissionsMap = {
      superadmin: [
        PermissionType.ViewIncome,
        PermissionType.ViewSales,
        PermissionType.CreateSales,
        PermissionType.UpdateSales,
        PermissionType.DeleteSales,
        PermissionType.ViewBusiness,
        PermissionType.CreateBusiness,
        PermissionType.UpdateBusiness,
        PermissionType.DeleteBusiness,
      ],
      admin: [
        PermissionType.ViewIncome,
        PermissionType.ViewSales,
        PermissionType.CreateSales,
        PermissionType.UpdateSales,
        PermissionType.ViewBusiness,
        PermissionType.CreateBusiness,
        PermissionType.UpdateBusiness,
      ],
      ceo: [
        PermissionType.ViewIncome,
        PermissionType.ViewSales,
        PermissionType.ViewBusiness,
      ],
      user: [
        PermissionType.ViewSales,
      ],
    };

    const permissions = rolePermissionsMap[roleName.toLowerCase()];
    if (!permissions) {
      throw new BadRequestException(`Unknown role: ${roleName}`);
    }

    return permissions;
  }

  private async validateResource(resourceType: ResourceType, resourceId: number) {
    switch (resourceType) {
      case ResourceType.Organization:
        const org = await this.organizationRepository.findOneBy({ id: resourceId });
        if (!org) {
          throw new NotFoundException(`Organization with ID ${resourceId} not found`);
        }
        break;
      case ResourceType.Company:
        const company = await this.companyRepository.findOneBy({ id: resourceId });
        if (!company) {
          throw new NotFoundException(`Company with ID ${resourceId} not found`);
        }
        break;
      case ResourceType.Venue:
        const venue = await this.venueRepository.findOneBy({ id: resourceId });
        if (!venue) {
          throw new NotFoundException(`Venue with ID ${resourceId} not found`);
        }
        break;
      default:
        throw new BadRequestException(`Invalid resource type: ${resourceType}`);
    }
  }

  async removeAllPermissions(userId: number) {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Obtener todos los permisos del usuario
    const permissions = await this.permissionRepository.find({
      where: { user: { id: userId } },
    });

    if (permissions.length === 0) {
      return { message: `User ${userId} has no permissions to remove` };
    }

    // Eliminar todos los permisos
    await this.permissionRepository.remove(permissions);

    return {
      message: `All permissions removed from user ${userId}`,
      removedCount: permissions.length,
      removedPermissions: permissions.map(p => ({
        permissionType: p.permissionType,
        resourceType: p.resourceType,
        resourceId: p.resourceId,
      })),
    };
  }
}
