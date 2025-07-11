import { StaffRole } from '../entities/staff-member.entity';
export declare class CreateStaffMemberDto {
    name: string;
    email?: string;
    phone?: string;
    position?: string;
    role?: StaffRole;
    isActive?: boolean;
    hireDate?: string;
    salary?: number;
    venueId: number;
}
