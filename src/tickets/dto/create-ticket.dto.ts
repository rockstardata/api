import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  venueId: number;
}
