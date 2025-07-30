import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role as RoleEnum } from '../role/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new user (Public)',
    description: `
    Register a new user account. This endpoint is public and anyone can create a user account.
    
    **Important:** The user will be created without any roles or permissions initially.
    After registration, the user can only login but cannot access protected endpoints.
    
    **To assign roles and permissions:**
    - A SuperAdmin or Admin must assign roles using the /users/assign-role endpoint
    - The user will then have access to the appropriate features based on their role
    
    **Example workflow:**
    1. User registers here (no permissions)
    2. User can login but has limited access
    3. Admin assigns role using /users/assign-role
    4. User now has appropriate permissions
    `,
  })
  @ApiResponse({
    status: 201,
    description:
      'User registered successfully. User can now login but has no permissions until roles are assigned.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user already exists',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.CEO)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.CEO)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({
    summary: 'Update user',
    description:
      'Update an existing user. Only SuperAdmin and Admin can update users.',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({
    summary: 'Delete user',
    description:
      'Delete a user from the system. Only SuperAdmin can delete users.',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can delete users',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // Nuevos endpoints para gestión de roles

  @Post('assign-role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({
    summary: 'Assign role to user',
    description:
      'Assign a role to a user in an organization or venue. Only SuperAdmin and Admin can assign roles.',
  })
  @ApiResponse({
    status: 201,
    description: 'Role assigned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user/role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.usersService.assignRole(assignRoleDto);
  }

  @Delete('remove-role/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({
    summary: 'Remove role from user',
    description:
      'Remove a role from a user in an organization or venue. Only SuperAdmin and Admin can remove roles.',
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    description: 'ID of the organization (if removing organization role)',
  })
  @ApiQuery({
    name: 'venueId',
    required: false,
    description: 'ID of the venue (if removing venue role)',
  })
  @ApiResponse({
    status: 200,
    description: 'Role removed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user not found',
  })
  @ApiResponse({
    status: 404,
    description: 'User or role assignment not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  removeRole(
    @Param('userId') userId: string,
    @Query('organizationId') organizationId?: string,
    @Query('venueId') venueId?: string,
  ) {
    return this.usersService.removeRole(
      +userId,
      organizationId ? +organizationId : undefined,
      venueId ? +venueId : undefined,
    );
  }

  @Get('roles/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.CEO)
  @ApiOperation({
    summary: 'Get user roles',
    description: 'Get all roles assigned to a specific user',
  })
  @ApiResponse({
    status: 200,
    description: 'User roles retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  getUserRoles(@Param('userId') userId: string) {
    return this.usersService.getUserRoles(+userId);
  }

  @Get('by-role/:roleId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({
    summary: 'Get users by role',
    description:
      'Get all users assigned to a specific role in an organization or venue',
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    description: 'ID of the organization',
  })
  @ApiQuery({
    name: 'venueId',
    required: false,
    description: 'ID of the venue',
  })
  @ApiResponse({
    status: 200,
    description: 'Users by role retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  getUsersByRole(
    @Param('roleId') roleId: string,
    @Query('organizationId') organizationId?: string,
    @Query('venueId') venueId?: string,
  ) {
    return this.usersService.getUsersByRole(
      +roleId,
      organizationId ? +organizationId : undefined,
      venueId ? +venueId : undefined,
    );
  }
}
