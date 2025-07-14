import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SyncService } from '../database/sync.service';
import * as bcrypt from 'bcrypt';
import { OrganizationUser } from 'src/organization/entities/organizationUser.entity';
import { Role } from 'src/role/entities/role.entity';

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
    // 1. Crear usuario
    const { password, ...userData } = createUserDto;
    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });
    const savedUser = await this.userRepository.save(user);

    // 2. Buscar el rol SuperAdmin
    let superAdminRole = await this.roleRepository.findOne({ where: { name: 'superadmin' } });
    if (!superAdminRole) {
      // Si no existe, lo creamos
      superAdminRole = this.roleRepository.create({ name: 'superadmin' });
      await this.roleRepository.save(superAdminRole);
    }

    // 3. Crear relación OrganizationUser
    const orgUser = this.organizationUserRepository.create({
      user: savedUser,
      organization: { id: organizationId } as any,
      role: superAdminRole,
    });
    await this.organizationUserRepository.save(orgUser);

    // 4. Sincronizar con base externa
    this.syncService.syncEntity('User', 'create', savedUser).catch(error => {
      console.error('Failed to sync user creation to external DB:', error);
    });

    return savedUser;
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
}
