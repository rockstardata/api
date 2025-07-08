import { IncomeService } from './income.service';
export declare class IncomeController {
    private readonly incomeService;
    constructor(incomeService: IncomeService);
    findIncomeByOrganization(orgId: number): {
        message: string;
    };
}
