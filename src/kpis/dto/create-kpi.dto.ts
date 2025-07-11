import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { KpiType, KpiPeriod } from '../entities/kpi.entity';

export class CreateKpiDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(KpiType)
  @IsOptional()
  type?: KpiType;

  @IsEnum(KpiPeriod)
  @IsOptional()
  period?: KpiPeriod;

  @IsNumber()
  @IsNotEmpty()
  targetValue: number;

  @IsNumber()
  @IsOptional()
  actualValue?: number;

  @IsNumber()
  @IsOptional()
  percentage?: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

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
