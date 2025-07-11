import { Company } from 'src/company/entities/company.entity';
import { UserVenueRole } from 'src/users/entities/user-venue-role.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Cost } from 'src/costs/entities/cost.entity';
import { Income } from 'src/income/entities/income.entity';
import { Kpi } from 'src/kpis/entities/kpi.entity';
import { Agreement } from 'src/agreements/entities/agreement.entity';
import { StaffMember } from 'src/staff-member/entities/staff-member.entity';
export declare class Venue {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    userVenueRoles: UserVenueRole[];
    tickets: Ticket[];
    sales: Sale[];
    costs: Cost[];
    incomes: Income[];
    kpis: Kpi[];
    agreements: Agreement[];
    staffMembers: StaffMember[];
}
