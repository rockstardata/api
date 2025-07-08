import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}