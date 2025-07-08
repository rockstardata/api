import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffMemberService } from './staff-member.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';

@Controller('staff-member')
export class StaffMemberController {
  constructor(private readonly staffMemberService: StaffMemberService) {}

  @Post()
  create(@Body() createStaffMemberDto: CreateStaffMemberDto) {
    return this.staffMemberService.create(createStaffMemberDto);
  }

  @Get()
  findAll() {
    return this.staffMemberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffMemberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffMemberDto: UpdateStaffMemberDto) {
    return this.staffMemberService.update(+id, updateStaffMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffMemberService.remove(+id);
  }
}
