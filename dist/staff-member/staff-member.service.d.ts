import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
export declare class StaffMemberService {
    create(createStaffMemberDto: CreateStaffMemberDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateStaffMemberDto: UpdateStaffMemberDto): string;
    remove(id: number): string;
}
