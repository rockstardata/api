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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role as RoleEnum } from './enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({
    summary: 'Create a new role',
    description:
      'Create a new role with specified permissions. Only SuperAdmin and Admin can create roles.',
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: Role,
  })
  @ApiResponse({
    status: 400,
    description: 'Role name already exists or invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.CEO)
  @ApiOperation({
    summary: 'Get all active roles',
    description: 'Retrieve all active roles in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: [Role],
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
    return this.roleService.findAll();
  }

  @Get('with-user-count')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({
    summary: 'Get roles with user count',
    description:
      'Retrieve all roles with the count of users assigned to each role',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles with user count retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  getRolesWithUserCount() {
    return this.roleService.getRolesWithUserCount();
  }

  @Get(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.CEO)
  @ApiOperation({
    summary: 'Get role by ID',
    description: 'Retrieve a specific role by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: Role,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
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
    return this.roleService.findOne(+id);
  }

  @Get('name/:name')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({
    summary: 'Get role by name',
    description: 'Retrieve a specific role by its name',
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: Role,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  findByName(@Param('name') name: string) {
    return this.roleService.findByName(name);
  }

  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({
    summary: 'Update role',
    description:
      'Update an existing role. Only SuperAdmin and Admin can update roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: Role,
  })
  @ApiResponse({
    status: 400,
    description: 'Role name already exists or invalid data',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({
    summary: 'Delete role',
    description:
      'Deactivate a role (soft delete). Only SuperAdmin can delete roles. Cannot delete roles that are currently assigned to users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Role deactivated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete role because it is being used by users',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can delete roles',
  })
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
