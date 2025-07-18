import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol (debe ser único)',
    example: 'manager',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Rol de gerente con permisos de gestión',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Permisos asociados al rol',
    example: ['view_sales', 'create_sales', 'update_sales'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}
