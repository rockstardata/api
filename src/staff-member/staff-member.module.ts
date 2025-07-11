import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffMemberService } from './staff-member.service';
import { StaffMemberController } from './staff-member.controller';
import { StaffMember } from './entities/staff-member.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffMember, Venue, User])],
  controllers: [StaffMemberController],
  providers: [StaffMemberService, SyncService],
  exports: [StaffMemberService],
})
export class StaffMemberModule {}
