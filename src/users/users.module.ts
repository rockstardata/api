import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SyncService } from '../database/sync.service';
import { OrganizationUser } from '../organization/entities/organizationUser.entity';
import { Role } from '../role/entities/role.entity';
import { UserVenueRole } from './entities/user-venue-role.entity';
import { Venue } from '../venue/entities/venue.entity';
import { Organization } from '../organization/entities/organization.entity';
import { UserPermission } from '../auth/entities/user-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OrganizationUser, Role, UserVenueRole, Venue, Organization, UserPermission])],
  controllers: [UsersController],
  providers: [UsersService, SyncService],
  exports: [UsersService],
})
export class UsersModule {}
