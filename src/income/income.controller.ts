import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from 'src/auth/decorators/check-permissions.decorator';
import { PermissionType } from 'src/auth/enums/permission-type.enum';
import { ResourceType } from 'src/auth/enums/resource-type.enum';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { IncomeService } from './income.service';

@Controller('income')
@UseGuards(AuthGuard('jwt')) // 1. Primero, el usuario debe estar autenticado.
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get('organization/:orgId')
  @UseGuards(PermissionsGuard) // 2. Luego, verificamos los permisos granulares.
  @CheckPermissions(PermissionType.ViewIncome, ResourceType.Organization, 'orgId')
  findIncomeByOrganization(@Param('orgId', ParseIntPipe) orgId: number) {
    // Si la petición llega aquí, el PermissionsGuard ha validado el acceso.
    return this.incomeService.findByOrganization(orgId);
  }
}