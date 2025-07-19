import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SyncService } from '../database/sync.service';
import * as bcrypt from 'bcrypt';
import { OrganizationUser } from 'src/organization/entities/organizationUser.entity';
import { Role } from 'src/role/entities/role.entity';
import { UserVenueRole } from './entities/user-venue-role.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { UserPermission } from 'src/auth/entities/user-permission.entity';
import { PermissionType } from 'src/auth/enums/permission-type.enum';
import { ResourceType } from 'src/auth/enums/resource-type.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly syncService: SyncService,
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserVenueRole)
    private readonly userVenueRoleRepository: Repository<UserVenueRole>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });
    const savedUser = await this.userRepository.save(user);

    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService.syncEntity('User', 'create', savedUser).catch(error => {
      console.error('Failed to sync user creation to external DB:', error);
    });

    return savedUser;
  }

  async createSuperAdmin(createUserDto: CreateUserDto, organizationId: number) {
    // 1. Verificar/Crear organización si no existe
    let organization = await this.organizationRepository.findOne({ where: { id: organizationId } });
    if (!organization) {
      organization = this.organizationRepository.create({ 
        id: organizationId,
        name: 'Organización Principal' 
      });
      await this.organizationRepository.save(organization);
      console.log(`Organización ${organizationId} creada automáticamente`);
    }

    // 2. Crear usuario
    const { password, ...userData } = createUserDto;
    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });
    const savedUser = await this.userRepository.save(user);

    // 3. Buscar el rol SuperAdmin
    let superAdminRole = await this.roleRepository.findOne({ where: { name: 'superadmin' } });
    if (!superAdminRole) {
      // Si no existe, lo creamos
      superAdminRole = this.roleRepository.create({ name: 'superadmin' });
      await this.roleRepository.save(superAdminRole);
    }

    // 4. Crear relación OrganizationUser
    const orgUser = this.organizationUserRepository.create({
      user: savedUser,
      organization: organization,
      role: superAdminRole,
    });
    await this.organizationUserRepository.save(orgUser);

    // 5. Asignar todos los permisos al super admin
    await this.assignAllPermissionsToSuperAdmin(savedUser.id, organizationId);

    // 6. Sincronizar con base externa
    this.syncService.syncEntity('User', 'create', savedUser).catch(error => {
      console.error('Failed to sync user creation to external DB:', error);
    });

    return savedUser;
  }

  private async assignAllPermissionsToSuperAdmin(userId: number, organizationId: number) {
    // Todos los tipos de permisos disponibles
    const allPermissions = [
      PermissionType.ViewIncome,
      PermissionType.ViewSales,
      PermissionType.CreateSales,
      PermissionType.UpdateSales,
      PermissionType.DeleteSales,
      PermissionType.ViewBusiness,
      PermissionType.CreateBusiness,
      PermissionType.UpdateBusiness,
      PermissionType.DeleteBusiness,
    ];

    // Asignar todos los permisos a nivel de organización
    for (const permissionType of allPermissions) {
      try {
        await this.assignPermissionToUser(userId, permissionType, ResourceType.Organization, organizationId);
      } catch (error) {
        console.error(`Error assigning permission ${permissionType}:`, error.message);
      }
    }

    console.log(`All permissions assigned to super admin user ${userId} for organization ${organizationId}`);
  }

  private async assignPermissionToUser(userId: number, permissionType: PermissionType, resourceType: ResourceType, resourceId: number) {
    // Verificar si el permiso ya existe
    const existingPermission = await this.userPermissionRepository.findOne({
      where: {
        user: { id: userId },
        permissionType,
        resourceType,
        resourceId,
      },
    });

    if (!existingPermission) {
      const permission = this.userPermissionRepository.create({
        user: { id: userId },
        permissionType,
        resourceType,
        resourceId,
      });
      await this.userPermissionRepository.save(permission);
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        organizationUsers: {
          role: true,
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      // Cargamos las relaciones para poder acceder a los roles del usuario
      relations: {
        organizationUsers: {
          role: true,
        },
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    // Sincronizar con base de datos externa de forma asíncrona
    this.syncService.syncEntity('User', 'update', updatedUser).catch(error => {
      console.error('Failed to sync user update to external DB:', error);
    });

    return updatedUser;
  }

  async remove(id: number) {
    await this.userRepository.delete(id);

    // Sincronizar eliminación con base de datos externa de forma asíncrona
    this.syncService.syncEntity('User', 'delete', { id }).catch(error => {
      console.error('Failed to sync user deletion to external DB:', error);
    });

    return `User with ID ${id} has been deleted`;
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const { userId, roleId, organizationId, venueId } = assignRoleDto;

    // Verificar que el usuario existe
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verificar que el rol existe
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Si se especifica organizationId, asignar rol de organización
    if (organizationId) {
      // Verificar que la organización existe
      const organization = await this.organizationRepository.findOneBy({ id: organizationId });
      if (!organization) {
        throw new NotFoundException(`Organization with ID ${organizationId} not found`);
      }

      // Verificar si ya existe la relación
      const existingOrgRole = await this.organizationUserRepository.findOne({
        where: { user: { id: userId }, organization: { id: organizationId } },
      });

      if (existingOrgRole) {
        // Actualizar el rol existente
        existingOrgRole.role = role;
        return await this.organizationUserRepository.save(existingOrgRole);
      } else {
        // Crear nueva relación
        const orgUser = this.organizationUserRepository.create({
          user: { id: userId },
          organization: { id: organizationId },
          role: role,
        });
        return await this.organizationUserRepository.save(orgUser);
      }
    }

    // Si se especifica venueId, asignar rol de venue
    if (venueId) {
      // Verificar que el venue existe
      const venue = await this.venueRepository.findOneBy({ id: venueId });
      if (!venue) {
        throw new NotFoundException(`Venue with ID ${venueId} not found`);
      }

      // Verificar si ya existe la relación
      const existingVenueRole = await this.userVenueRoleRepository.findOne({
        where: { user: { id: userId }, venue: { id: venueId } },
      });

      if (existingVenueRole) {
        // Actualizar el rol existente
        existingVenueRole.role = role;
        return await this.userVenueRoleRepository.save(existingVenueRole);
      } else {
        // Crear nueva relación
        const userVenueRole = this.userVenueRoleRepository.create({
          user: { id: userId },
          venue: { id: venueId },
          role: role,
        });
        return await this.userVenueRoleRepository.save(userVenueRole);
      }
    }

    throw new BadRequestException('Either organizationId or venueId must be provided');
  }

  async removeRole(userId: number, organizationId?: number, venueId?: number) {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (organizationId) {
      // Verificar que la organización existe
      const organization = await this.organizationRepository.findOneBy({ id: organizationId });
      if (!organization) {
        throw new NotFoundException(`Organization with ID ${organizationId} not found`);
      }

      const orgUser = await this.organizationUserRepository.findOne({
        where: { user: { id: userId }, organization: { id: organizationId } },
      });

      if (!orgUser) {
        throw new NotFoundException(`User ${userId} is not assigned to organization ${organizationId}`);
      }

      await this.organizationUserRepository.remove(orgUser);
      return { message: `Role removed from user ${userId} in organization ${organizationId}` };
    }

    if (venueId) {
      // Verificar que el venue existe
      const venue = await this.venueRepository.findOneBy({ id: venueId });
      if (!venue) {
        throw new NotFoundException(`Venue with ID ${venueId} not found`);
      }

      const userVenueRole = await this.userVenueRoleRepository.findOne({
        where: { user: { id: userId }, venue: { id: venueId } },
      });

      if (!userVenueRole) {
        throw new NotFoundException(`User ${userId} is not assigned to venue ${venueId}`);
      }

      await this.userVenueRoleRepository.remove(userVenueRole);
      return { message: `Role removed from user ${userId} in venue ${venueId}` };
    }

    throw new BadRequestException('Either organizationId or venueId must be provided');
  }

  async getUserRoles(userId: number) {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const userWithRoles = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        organizationUsers: {
          role: true,
          organization: true,
        },
        userVenueRoles: {
          role: true,
          venue: true,
        },
      },
    });

    if (!userWithRoles) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      userId: userWithRoles.id,
      userEmail: userWithRoles.email,
      organizationRoles: userWithRoles.organizationUsers.map(ou => ({
        organizationId: ou.organization.id,
        organizationName: ou.organization.name,
        roleId: ou.role.id,
        roleName: ou.role.name,
        roleDescription: ou.role.description,
      })),
      venueRoles: userWithRoles.userVenueRoles.map(uvr => ({
        venueId: uvr.venue.id,
        venueName: uvr.venue.name,
        roleId: uvr.role.id,
        roleName: uvr.role.name,
        roleDescription: uvr.role.description,
      })),
    };
  }

  async getUsersByRole(roleId: number, organizationId?: number, venueId?: number) {
    // Verificar que el rol existe
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    if (organizationId) {
      const users = await this.organizationUserRepository.find({
        where: { role: { id: roleId }, organization: { id: organizationId } },
        relations: ['user', 'organization'],
      });

      return users.map(ou => ({
        userId: ou.user.id,
        userEmail: ou.user.email,
        userFirstName: ou.user.firstName,
        userLastName: ou.user.lastName,
        organizationId: ou.organization.id,
        organizationName: ou.organization.name,
        roleId: ou.role.id,
        roleName: ou.role.name,
      }));
    }

    if (venueId) {
      const users = await this.userVenueRoleRepository.find({
        where: { role: { id: roleId }, venue: { id: venueId } },
        relations: ['user', 'venue'],
      });

      return users.map(uvr => ({
        userId: uvr.user.id,
        userEmail: uvr.user.email,
        userFirstName: uvr.user.firstName,
        userLastName: uvr.user.lastName,
        venueId: uvr.venue.id,
        venueName: uvr.venue.name,
        roleId: uvr.role.id,
        roleName: uvr.role.name,
      }));
    }

    throw new BadRequestException('Either organizationId or venueId must be provided');
  }
}
