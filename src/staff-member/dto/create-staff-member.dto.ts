import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { StaffRole } from '../entities/staff-member.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffMemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  phone?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  position?: string;
  @ApiProperty()
  @IsEnum(StaffRole)
  @IsOptional()
  role?: StaffRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  hireDate?: string;

  @IsNumber()
  @IsOptional()
  salary?: number;

  @IsNumber()
  @IsNotEmpty()
  venueId: number;
}
