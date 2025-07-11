import { StaffMemberService } from './staff-member.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { StaffMember, StaffRole } from './entities/staff-member.entity';
export declare class StaffMemberController {
    private readonly staffMemberService;
    constructor(staffMemberService: StaffMemberService);
    create(createStaffMemberDto: CreateStaffMemberDto, req: any): Promise<StaffMember>;
    findAll(venueId?: string, role?: StaffRole): Promise<StaffMember[]>;
    findByVenue(venueId: string): Promise<StaffMember[]>;
    findByRole(role: StaffRole): Promise<StaffMember[]>;
    findActiveStaff(venueId?: string): Promise<StaffMember[]>;
    getStaffBySalaryRange(venueId: string, minSalary: string, maxSalary: string): Promise<StaffMember[]>;
    getTotalSalaryByVenue(venueId: string): Promise<any>;
    getStaffCountByRole(venueId: string): Promise<any[]>;
    findOne(id: string): Promise<StaffMember>;
    update(id: string, updateStaffMemberDto: UpdateStaffMemberDto, req: any): Promise<StaffMember>;
    remove(id: string): Promise<void>;
    getStaffRoles(): Promise<StaffRole[]>;
}
