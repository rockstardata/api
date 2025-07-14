import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SyncService } from '../database/sync.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly syncService: SyncService,
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
