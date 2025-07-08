import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    private permissionRepository;
    constructor(reflector: Reflector, permissionRepository: Repository<UserPermission>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
