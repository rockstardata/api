import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Repository } from 'typeorm';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { UserPermission } from './entities/user-permission.entity';
import { ResourceType } from './enums/resource-type.enum';

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
}
