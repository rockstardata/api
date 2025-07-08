import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../enums/permission-type.enum';
import { ResourceType } from 'src/auth/enums/resource-type.enum';

export const PERMISSIONS_KEY = 'permissions';

export const CheckPermissions = (
  permission: PermissionType,
  resource: ResourceType,
  resourceIdParam = 'id', // El nombre del parámetro en la URL que contiene el ID del recurso
) => SetMetadata(PERMISSIONS_KEY, { permission, resource, resourceIdParam });