import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { AgreementStatus, AgreementType } from '../entities/agreement.entity';

export class CreateAgreementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(AgreementType)
  @IsOptional()
  type?: AgreementType;

  @IsEnum(AgreementStatus)
  @IsOptional()
  status?: AgreementStatus;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsString()
  @IsOptional()
  contractNumber?: string;

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
