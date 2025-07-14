import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { KpiType, KpiPeriod } from '../entities/kpi.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKpiDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsEnum(KpiType)
  @IsOptional()
  type?: KpiType;
  @ApiProperty()
  @IsEnum(KpiPeriod)
  @IsOptional()
  period?: KpiPeriod;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  targetValue: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  actualValue?: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  percentage?: number;
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: string;
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  venueId: number;

  @IsNumber()
  @IsOptional()
  responsiblePersonId?: number;
}
