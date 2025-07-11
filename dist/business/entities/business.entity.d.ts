import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Business {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    createdBy: User;
}
