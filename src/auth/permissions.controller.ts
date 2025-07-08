import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/role/enums/role.enum';
import { Roles } from './decorators/roles.decorator';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post('assign')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SuperAdmin)
  assignPermission(@Body() assignPermissionDto: AssignPermissionDto) {
    return this.permissionsService.assign(assignPermissionDto);
  }
}