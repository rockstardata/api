import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { IncomeCategory, IncomeStatus } from '../entities/income.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIncomeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @ApiProperty()
  @IsEnum(IncomeCategory)
  @IsOptional()
  category?: IncomeCategory;

  @IsEnum(IncomeStatus)
  @IsOptional()
  status?: IncomeStatus;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsString()
  @IsOptional()
  customer?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  venueId: number;

  @IsNumber()
  @IsOptional()
  saleId?: number;

  @IsNumber()
  @IsOptional()
  receivedById?: number;
}
