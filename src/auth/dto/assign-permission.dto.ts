import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { PermissionType } from '../enums/permission-type.enum';
import { ResourceType } from '../enums/resource-type.enum';

export class AssignPermissionDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsEnum(PermissionType)
  @IsNotEmpty()
  permissionType: PermissionType;

  @IsEnum(ResourceType)
  @IsNotEmpty()
  resourceType: ResourceType;

  @IsInt()
  @IsNotEmpty()
  resourceId: number;
}