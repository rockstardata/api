import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
import { PERMISSIONS_KEY } from '../decorators/check-permissions.decorator';
import { PermissionType } from '../enums/permission-type.enum';
import { ResourceType } from '../enums/resource-type.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserPermission)
    private permissionRepository: Repository<UserPermission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<{
      permission: PermissionType;
      resource: ResourceType;
      resourceIdParam: string;
    }>(PERMISSIONS_KEY, context.getHandler());

    if (!requiredPermission) {
      return true; // Si no se requieren permisos, se permite el acceso.
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = parseInt(
      request.params[requiredPermission.resourceIdParam],
      10,
    );

    const hasPermission = await this.permissionRepository.findOneBy({
      user: { id: user.id },
      permissionType: requiredPermission.permission,
      resourceType: requiredPermission.resource,
      resourceId: resourceId,
    });

    return !!hasPermission;
  }
}
