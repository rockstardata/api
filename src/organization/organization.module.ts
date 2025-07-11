import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationUser } from './entities/organizationUser.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationUser, User])],
  controllers: [OrganizationController],
  providers: [OrganizationService, SyncService],
})
export class OrganizationModule {}
