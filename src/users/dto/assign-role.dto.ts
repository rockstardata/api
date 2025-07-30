import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

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
    description: 'ID de la organización a la que pertenece el usuario',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  organizationId: number;

  @ApiProperty({
    description: 'Lista de IDs de compañías a las que se asignará el rol',
    example: [1, 2],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  companyIds?: number[];

  @ApiProperty({
    description: 'Lista de IDs de locales a los que se asignará el rol',
    example: [5, 6],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  venueIds?: number[];
}
