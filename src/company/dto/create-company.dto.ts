import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  website?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  @ApiProperty()
  @IsNumber()
  organizationId: number;
}
