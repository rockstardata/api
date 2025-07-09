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
import { PermissionsService } from './permissions.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { PermissionType } from './enums/permission-type.enum';
import { ResourceType } from './enums/resource-type.enum';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('assign')
  assign(@Body() assignPermissionDto: AssignPermissionDto) {
    return this.permissionsService.assign(assignPermissionDto);
  }

  @Post('sales/organization/:organizationId/user/:userId')
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

  @Post('sales/business/:businessId/user/:userId')
  assignSalesPermissionToBusiness(
    @Param('businessId') businessId: string,
    @Param('userId') userId: string,
    @Query('permissionType') permissionType?: string,
  ) {
    const permission = permissionType 
      ? (permissionType as PermissionType)
      : PermissionType.ViewSales;
    
    return this.permissionsService.assignSalesPermissionToBusiness(
      +userId,
      +businessId,
      permission,
    );
  }

  @Post('sales/venue/:venueId/user/:userId')
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
  getUserPermissions(@Param('userId') userId: string) {
    return this.permissionsService.getUserPermissions(+userId);
  }

  @Get('check/:userId')
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

  @Delete('remove/:userId')
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
}