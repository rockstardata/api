import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { PermissionType } from '../enums/permission-type.enum';
import { ResourceType } from '../enums/resource-type.enum';

export class AssignPermissionDto {
  @ApiProperty({
    description: 'The ID of the user to assign the permission to',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'The type of permission to assign',
    enum: PermissionType,
    example: PermissionType.ViewSales,
  })
  @IsEnum(PermissionType)
  @IsNotEmpty()
  permissionType: PermissionType;

  @ApiProperty({
    description: 'The type of resource the permission applies to',
    enum: ResourceType,
    example: ResourceType.Venue,
  })
  @IsEnum(ResourceType)
  @IsNotEmpty()
  resourceType: ResourceType;

  @ApiProperty({
    description: 'The ID of the resource the permission applies to',
    example: 101,
  })
  @IsInt()
  @IsNotEmpty()
  resourceId: number;
}
