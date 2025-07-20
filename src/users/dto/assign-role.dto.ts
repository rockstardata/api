import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({
    description: 'ID del usuario al que se le asignará el rol',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID del rol a asignar',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @ApiProperty({
    description: 'ID de la organización (requerido para roles de organización)',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  organizationId?: number;

  @ApiProperty({
    description: 'ID del local/venue (requerido para roles de venue)',
    example: 5,
    required: false,
  })
  @IsInt()
  @IsOptional()
  venueId?: number;
} 