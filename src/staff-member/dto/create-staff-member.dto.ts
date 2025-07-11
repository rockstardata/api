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

export class CreateStaffMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  position?: string;

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
