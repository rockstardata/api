import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StaffMemberService } from './staff-member.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { StaffMember, StaffRole } from './entities/staff-member.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/role/enums/role.enum';

@ApiTags('staff-members')
@Controller('staff-members')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class StaffMemberController {
  constructor(private readonly staffMemberService: StaffMemberService) {}

  @Post()
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiResponse({ status: 201, description: 'Staff member created successfully', type: StaffMember })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createStaffMemberDto: CreateStaffMemberDto, @Request() req) {
    return this.staffMemberService.create(createStaffMemberDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all staff members' })
  @ApiQuery({ name: 'venueId', required: false, description: 'Filter by venue ID' })
  @ApiQuery({ name: 'role', required: false, description: 'Filter by staff role' })
  @ApiResponse({ status: 200, description: 'Staff members retrieved successfully', type: [StaffMember] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query('venueId') venueId?: string,
    @Query('role') role?: StaffRole,
  ) {
    return this.staffMemberService.findAll(
      venueId ? +venueId : undefined,
      role,
    );
  }

  @Get('venue/:venueId')
  @ApiOperation({ summary: 'Get staff members by venue' })
  @ApiResponse({ status: 200, description: 'Staff members retrieved successfully', type: [StaffMember] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByVenue(@Param('venueId') venueId: string) {
    return this.staffMemberService.findByVenue(+venueId);
  }

  @Get('role/:role')
  @ApiOperation({ summary: 'Get staff members by role' })
  @ApiResponse({ status: 200, description: 'Staff members retrieved successfully', type: [StaffMember] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByRole(@Param('role') role: StaffRole) {
    return this.staffMemberService.findByRole(role);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active staff members' })
  @ApiQuery({ name: 'venueId', required: false, description: 'Filter by venue ID' })
  @ApiResponse({ status: 200, description: 'Active staff members retrieved successfully', type: [StaffMember] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findActiveStaff(@Query('venueId') venueId?: string) {
    return this.staffMemberService.findActiveStaff(venueId ? +venueId : undefined);
  }

  @Get('salary-range/:venueId')
  @ApiOperation({ summary: 'Get staff members by salary range' })
  @ApiQuery({ name: 'minSalary', required: true, description: 'Minimum salary' })
  @ApiQuery({ name: 'maxSalary', required: true, description: 'Maximum salary' })
  @ApiResponse({ status: 200, description: 'Staff members retrieved successfully', type: [StaffMember] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStaffBySalaryRange(
    @Param('venueId') venueId: string,
    @Query('minSalary') minSalary: string,
    @Query('maxSalary') maxSalary: string,
  ) {
    return this.staffMemberService.getStaffBySalaryRange(+venueId, +minSalary, +maxSalary);
  }

  @Get('total-salary/:venueId')
  @ApiOperation({ summary: 'Get total salary by venue' })
  @ApiResponse({ status: 200, description: 'Total salary calculated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTotalSalaryByVenue(@Param('venueId') venueId: string) {
    return this.staffMemberService.getTotalSalaryByVenue(+venueId);
  }

  @Get('count-by-role/:venueId')
  @ApiOperation({ summary: 'Get staff count by role' })
  @ApiResponse({ status: 200, description: 'Staff count by role retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStaffCountByRole(@Param('venueId') venueId: string) {
    return this.staffMemberService.getStaffCountByRole(+venueId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get staff member by ID' })
  @ApiResponse({ status: 200, description: 'Staff member retrieved successfully', type: StaffMember })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    return this.staffMemberService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.CEO)
  @ApiOperation({ summary: 'Update staff member' })
  @ApiResponse({ status: 200, description: 'Staff member updated successfully', type: StaffMember })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateStaffMemberDto: UpdateStaffMemberDto,
    @Request() req,
  ) {
    return this.staffMemberService.update(+id, updateStaffMemberDto, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete staff member' })
  @ApiResponse({ status: 204, description: 'Staff member deleted successfully' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string) {
    return this.staffMemberService.remove(+id);
  }

  @Get('roles/all')
  @ApiOperation({ summary: 'Get all staff roles' })
  @ApiResponse({ status: 200, description: 'Staff roles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStaffRoles() {
    return Object.values(StaffRole);
  }
}
