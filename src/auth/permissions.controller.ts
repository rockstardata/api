import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { PermissionType } from './enums/permission-type.enum';
import { ResourceType } from './enums/resource-type.enum';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from 'src/role/enums/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post('assign')
  @ApiOperation({
    summary: 'Assign permission to user',
    description:
      'Assign a specific permission to a user for a resource. Only SuperAdmin can assign permissions.',
  })
  @ApiResponse({
    status: 201,
    description: 'Permission assigned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Permission already exists or invalid data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can assign permissions',
  })
  assign(@Body() assignPermissionDto: AssignPermissionDto) {
    return this.permissionsService.assign(assignPermissionDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post('assign-role-permissions')
  @ApiOperation({
    summary: 'Assign permissions based on role',
    description:
      'Assign multiple permissions to a user based on their role. Only SuperAdmin can assign role-based permissions.',
  })
  @ApiResponse({
    status: 201,
    description: 'Role permissions assigned successfully',
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
    description: 'Forbidden - Only SuperAdmin can assign role permissions',
  })
  assignRolePermissions(@Body() assignRolePermissionsDto: AssignRolePermissionsDto) {
    return this.permissionsService.assignRolePermissions(
      assignRolePermissionsDto.userId,
      assignRolePermissionsDto.roleName,
      assignRolePermissionsDto.resourceType,
      assignRolePermissionsDto.resourceId,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post('sales/organization/:organizationId/user/:userId')
  @ApiOperation({
    summary: 'Assign sales permission to user in organization',
    description:
      'Assign sales-related permissions to a user in an organization. Only SuperAdmin can assign permissions.',
  })
  @ApiQuery({
    name: 'permissionType',
    required: false,
    description: 'Type of sales permission (default: view_sales)',
  })
  @ApiResponse({
    status: 201,
    description: 'Sales permission assigned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user/organization not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can assign permissions',
  })
  assignSalesPermissionToOrganization(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
    @Query('permissionType') permissionType?: string,
  ) {
    const permission = permissionType
      ? (permissionType as PermissionType)
      : PermissionType.ViewSales;

    return this.permissionsService.assignSalesPermissionToOrganization(
      +userId,
      +organizationId,
      permission,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post('sales/company/:companyId/user/:userId')
  @ApiOperation({
    summary: 'Assign sales permission to user in company',
    description:
      'Assign sales-related permissions to a user in a company. Only SuperAdmin can assign permissions.',
  })
  @ApiQuery({
    name: 'permissionType',
    required: false,
    description: 'Type of sales permission (default: view_sales)',
  })
  @ApiResponse({
    status: 201,
    description: 'Sales permission assigned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user/company not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can assign permissions',
  })
  assignSalesPermissionToCompany(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Query('permissionType') permissionType?: string,
  ) {
    const permission = permissionType
      ? (permissionType as PermissionType)
      : PermissionType.ViewSales;

    return this.permissionsService.assignSalesPermissionToCompany(
      +userId,
      +companyId,
      permission,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SuperAdmin)
  @Post('sales/venue/:venueId/user/:userId')
  @ApiOperation({
    summary: 'Assign sales permission to user in venue',
    description:
      'Assign sales-related permissions to a user in a venue. Only SuperAdmin can assign permissions.',
  })
  @ApiQuery({
    name: 'permissionType',
    required: false,
    description: 'Type of sales permission (default: view_sales)',
  })
  @ApiResponse({
    status: 201,
    description: 'Sales permission assigned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or user/venue not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can assign permissions',
  })
  assignSalesPermissionToVenue(
    @Param('venueId') venueId: string,
    @Param('userId') userId: string,
    @Query('permissionType') permissionType?: string,
  ) {
    const permission = permissionType
      ? (permissionType as PermissionType)
      : PermissionType.ViewSales;

    return this.permissionsService.assignSalesPermissionToVenue(
      +userId,
      +venueId,
      permission,
    );
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get user permissions',
    description: 'Get all permissions assigned to a specific user',
  })
  @ApiResponse({
    status: 200,
    description: 'User permissions retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  getUserPermissions(@Param('userId') userId: string) {
    return this.permissionsService.getUserPermissions(+userId);
  }

  @Get('check/:userId')
  @ApiOperation({
    summary: 'Check user permission',
    description: 'Check if a user has a specific permission for a resource',
  })
  @ApiQuery({
    name: 'permissionType',
    required: true,
    description: 'Type of permission to check',
  })
  @ApiQuery({
    name: 'resourceType',
    required: true,
    description: 'Type of resource',
  })
  @ApiQuery({
    name: 'resourceId',
    required: true,
    description: 'ID of the resource',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission check result',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  checkPermission(
    @Param('userId') userId: string,
    @Query('permissionType') permissionType: string,
    @Query('resourceType') resourceType: string,
    @Query('resourceId') resourceId: string,
  ) {
    return this.permissionsService.hasPermission(
      +userId,
      permissionType as PermissionType,
      resourceType as ResourceType,
      +resourceId,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SuperAdmin)
  @Delete('remove/:userId')
  @ApiOperation({
    summary: 'Remove user permission',
    description:
      'Remove a specific permission from a user. Only SuperAdmin can remove permissions.',
  })
  @ApiQuery({
    name: 'permissionType',
    required: true,
    description: 'Type of permission to remove',
  })
  @ApiQuery({
    name: 'resourceType',
    required: true,
    description: 'Type of resource',
  })
  @ApiQuery({
    name: 'resourceId',
    required: true,
    description: 'ID of the resource',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Permission not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only SuperAdmin can remove permissions',
  })
  removePermission(
    @Param('userId') userId: string,
    @Query('permissionType') permissionType: string,
    @Query('resourceType') resourceType: string,
    @Query('resourceId') resourceId: string,
  ) {
    return this.permissionsService.removePermission(
      +userId,
      permissionType as PermissionType,
      resourceType as ResourceType,
      +resourceId,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SuperAdmin)
  @Delete('remove-all/:userId')
  @ApiOperation({
    summary: 'Remove all user permissions',
    description:
      'Remove all permissions from a user. Only SuperAdmin can remove all permissions.',
  })
  @ApiResponse({
    status: 200,
    description: 'All permissions removed successfully',
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
    description: 'Forbidden - Only SuperAdmin can remove all permissions',
  })
  removeAllPermissions(@Param('userId') userId: string) {
    return this.permissionsService.removeAllPermissions(+userId);
  }
}
