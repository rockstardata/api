import { Business } from 'src/business/entities/business.entity';
import { User } from 'src/users/entities/user.entity';
export declare enum StaffRole {
    MANAGER = "manager",
    EMPLOYEE = "employee",
    CASHIER = "cashier",
    WAITER = "waiter",
    OTHER = "other"
}
export declare class StaffMember {
    id: number;
    name: string;
    email: string;
    phone: string;
    position: string;
    role: StaffRole;
    isActive: boolean;
    hireDate: Date;
    salary: number;
    createdAt: Date;
    updatedAt: Date;
    business: Business;
    user: User;
}
