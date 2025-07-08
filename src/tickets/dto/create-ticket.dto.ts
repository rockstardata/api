import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CreateSaleDto } from 'src/sales/dto/create-sale.dto';

export class CreateTicketDto {
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsNumber()
  @IsNotEmpty()
  venueId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDto)
  sales: CreateSaleDto[];
}
