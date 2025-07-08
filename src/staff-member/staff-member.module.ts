import { Module } from '@nestjs/common';
import { StaffMemberService } from './staff-member.service';
import { StaffMemberController } from './staff-member.controller';

@Module({
  controllers: [StaffMemberController],
  providers: [StaffMemberService],
})
export class StaffMemberModule {}
