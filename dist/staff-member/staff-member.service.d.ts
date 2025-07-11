import { Repository } from 'typeorm';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { StaffMember, StaffRole } from './entities/staff-member.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';
export declare class StaffMemberService {
    private staffMemberRepository;
    private venueRepository;
    private userRepository;
    private readonly syncService;
    constructor(staffMemberRepository: Repository<StaffMember>, venueRepository: Repository<Venue>, userRepository: Repository<User>, syncService: SyncService);
    create(createStaffMemberDto: CreateStaffMemberDto, userId: number): Promise<StaffMember>;
    findAll(venueId?: number, role?: string): Promise<StaffMember[]>;
    findOne(id: number): Promise<StaffMember>;
    update(id: number, updateStaffMemberDto: UpdateStaffMemberDto, userId: number): Promise<StaffMember>;
    remove(id: number): Promise<void>;
    findByVenue(venueId: number): Promise<StaffMember[]>;
    findByRole(role: StaffRole): Promise<StaffMember[]>;
    findActiveStaff(venueId?: number): Promise<StaffMember[]>;
    getStaffBySalaryRange(venueId: number, minSalary: number, maxSalary: number): Promise<StaffMember[]>;
    getTotalSalaryByVenue(venueId: number): Promise<any>;
    getStaffCountByRole(venueId: number): Promise<any[]>;
}
