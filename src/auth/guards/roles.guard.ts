import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/role/enums/role.enum';
import { User } from 'src/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    if (!user || !user.organizationUsers) {
      return false;
    }

    const userRoles = user.organizationUsers.map(
      (orgUser) => orgUser.role.name,
    );

    // Si el usuario es superadmin, siempre tiene acceso
    if (userRoles.includes(Role.SuperAdmin)) {
      return true;
    }

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
