import { StaffMemberService } from './staff-member.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
export declare class StaffMemberController {
    private readonly staffMemberService;
    constructor(staffMemberService: StaffMemberService);
    create(createStaffMemberDto: CreateStaffMemberDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateStaffMemberDto: UpdateStaffMemberDto): string;
    remove(id: string): string;
}
