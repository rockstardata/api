import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verificar si ya existe un rol con ese nombre
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new BadRequestException(`Role with name "${createRoleDto.name}" already exists`);
    }

    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id, isActive: true },
      relations: ['organizationUsers', 'userVenueRoles'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    return role;
  }

  async findByName(name: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otro rol con ese nombre
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new BadRequestException(`Role with name "${updateRoleDto.name}" already exists`);
      }
    }

    await this.roleRepository.update(id, updateRoleDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const role = await this.findOne(id);

    // Verificar si el rol está siendo usado
    const organizationUsersCount = role.organizationUsers?.length || 0;
    const userVenueRolesCount = role.userVenueRoles?.length || 0;

    if (organizationUsersCount > 0 || userVenueRolesCount > 0) {
      throw new BadRequestException(
        `Cannot delete role "${role.name}" because it is being used by ${organizationUsersCount + userVenueRolesCount} users`
      );
    }

    // Soft delete - marcar como inactivo en lugar de eliminar
    await this.roleRepository.update(id, { isActive: false });
    
    return { message: `Role "${role.name}" has been deactivated successfully` };
  }

  async getRolesWithUserCount(): Promise<any[]> {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoin('role.organizationUsers', 'orgUsers')
      .leftJoin('role.userVenueRoles', 'venueRoles')
      .select([
        'role.id',
        'role.name',
        'role.description',
        'role.isActive',
        'role.createdAt',
        'role.updatedAt',
      ])
      .addSelect('COUNT(DISTINCT orgUsers.id)', 'organizationUsersCount')
      .addSelect('COUNT(DISTINCT venueRoles.id)', 'venueRolesCount')
      .where('role.isActive = :isActive', { isActive: true })
      .groupBy('role.id')
      .orderBy('role.name', 'ASC')
      .getRawMany();

    return roles.map(role => ({
      id: role.role_id,
      name: role.role_name,
      description: role.role_description,
      isActive: role.role_isActive,
      createdAt: role.role_createdAt,
      updatedAt: role.role_updatedAt,
      totalUsers: parseInt(role.organizationUsersCount) + parseInt(role.venueRolesCount),
      organizationUsersCount: parseInt(role.organizationUsersCount),
      venueRolesCount: parseInt(role.venueRolesCount),
    }));
  }
}
