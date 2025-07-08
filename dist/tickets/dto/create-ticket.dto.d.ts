import { CreateSaleDto } from 'src/sales/dto/create-sale.dto';
export declare class CreateTicketDto {
    totalAmount: number;
    venueId: number;
    sales: CreateSaleDto[];
}
