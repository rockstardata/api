import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ResourceType } from '../enums/resource-type.enum';

export class AssignRolePermissionsDto {
  @ApiProperty({
    description: 'The ID of the user to assign permissions to',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'The name of the role whose permissions will be assigned',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty({
    description: 'The type of resource the permissions apply to',
    enum: ResourceType,
    example: ResourceType.Organization,
  })
  @IsEnum(ResourceType)
  @IsNotEmpty()
  resourceType: ResourceType;

  @ApiProperty({
    description: 'The ID of the resource the permissions apply to',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  resourceId: number;
}
