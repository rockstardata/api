import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
export declare class SalesService {
    private readonly saleRepository;
    constructor(saleRepository: Repository<Sale>);
}
