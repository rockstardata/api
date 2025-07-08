import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationUser } from './entities/organizationUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationUser])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
