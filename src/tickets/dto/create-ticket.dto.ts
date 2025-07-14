import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CreateSaleDto } from 'src/sales/dto/create-sale.dto';

export class CreateTicketDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  venueId: number;
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDto)
  sales: CreateSaleDto[];
}
