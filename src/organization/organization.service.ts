import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationUser } from './entities/organizationUser.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    const organization = this.organizationRepository.create(
      createOrganizationDto,
    );
    return this.organizationRepository.save(organization);
  }

  findAll() {
    return this.organizationRepository.find();
  }

  async findOne(id: number) {
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
    return organization;
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.organizationRepository.preload({
      id,
      ...updateOrganizationDto,
    });
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
    return this.organizationRepository.save(organization);
  }

  async remove(id: number) {
    const organization = await this.findOne(id);
    return this.organizationRepository.remove(organization);
  }

  async assignUserToOrganization(orgId: number, userId: number) {
    const organization = await this.organizationRepository.findOneBy({ id: orgId });
    if (!organization) throw new NotFoundException('Organization not found');
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    const existing = await this.organizationUserRepository.findOne({ where: { organization: { id: orgId }, user: { id: userId } } });
    if (existing) throw new BadRequestException('User already assigned to this organization');
    const orgUser = this.organizationUserRepository.create({ organization, user });
    return this.organizationUserRepository.save(orgUser);
  }
}
