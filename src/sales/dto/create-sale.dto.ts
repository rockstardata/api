import { IsNotEmpty, IsNumber, IsString, Min, IsOptional, IsEnum } from 'class-validator';
import { PaymentMethod, SaleStatus } from '../entities/sale.entity';

export class CreateSaleDto {
  // Información del producto
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  // Método de pago (opcional, por defecto CASH)
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  // Estado de la venta (opcional, por defecto COMPLETED)
  @IsEnum(SaleStatus)
  @IsOptional()
  status?: SaleStatus;

  // Notas adicionales
  @IsString()
  @IsOptional()
  notes?: string;

  // RELACIONES - Solo necesitas especificar UNA de estas opciones:
  
  // Opción 1: Si quieres asociar la venta a un ticket existente
  @IsNumber()
  @IsOptional()
  ticketId?: number;

  // Opción 2: Si quieres asociar la venta a un local específico
  @IsNumber()
  @IsOptional()
  venueId?: number;
}