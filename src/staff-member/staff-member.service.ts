import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { StaffMember, StaffRole } from './entities/staff-member.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Injectable()
export class StaffMemberService {
  constructor(
    @InjectRepository(StaffMember)
    private staffMemberRepository: Repository<StaffMember>,
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly syncService: SyncService,
  ) {}

  async create(createStaffMemberDto: CreateStaffMemberDto, userId: number) {
    const venue = await this.venueRepository.findOne({
      where: { id: createStaffMemberDto.venueId },
    });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    const staffMember = this.staffMemberRepository.create({
      ...createStaffMemberDto,
      venue,
      user: { id: userId },
      hireDate: createStaffMemberDto.hireDate ? new Date(createStaffMemberDto.hireDate) : null,
    });

    const savedStaffMember = await this.staffMemberRepository.save(staffMember);
    this.syncService.syncEntity('StaffMember', 'create', savedStaffMember).catch(error => {
      console.error('Failed to sync staff member creation to external DB:', error);
    });
    return savedStaffMember;
  }

  async findAll(venueId?: number, role?: string) {
    const query = this.staffMemberRepository.createQueryBuilder('staffMember')
      .leftJoinAndSelect('staffMember.venue', 'venue')
      .leftJoinAndSelect('staffMember.user', 'user');

    if (venueId) {
      query.where('venue.id = :venueId', { venueId });
    }

    if (role) {
      query.andWhere('staffMember.role = :role', { role });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const staffMember = await this.staffMemberRepository.findOne({
      where: { id },
      relations: ['venue', 'user'],
    });

    if (!staffMember) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }

    return staffMember;
  }

  async update(id: number, updateStaffMemberDto: UpdateStaffMemberDto, userId: number) {
    const staffMember = await this.findOne(id);

    if (updateStaffMemberDto.venueId) {
      const venue = await this.venueRepository.findOne({
        where: { id: updateStaffMemberDto.venueId },
      });
      if (venue) {
        staffMember.venue = venue;
      }
    }

    if (updateStaffMemberDto.hireDate) {
      staffMember.hireDate = new Date(updateStaffMemberDto.hireDate);
    }

    Object.assign(staffMember, updateStaffMemberDto);
    const updatedStaffMember = await this.staffMemberRepository.save(staffMember);
    this.syncService.syncEntity('StaffMember', 'update', updatedStaffMember).catch(error => {
      console.error('Failed to sync staff member update to external DB:', error);
    });
    return updatedStaffMember;
  }

  async remove(id: number) {
    const staffMember = await this.findOne(id);
    await this.staffMemberRepository.remove(staffMember);
    this.syncService.syncEntity('StaffMember', 'delete', { id }).catch(error => {
      console.error('Failed to sync staff member deletion to external DB:', error);
    });
  }

  async findByVenue(venueId: number) {
    return this.staffMemberRepository.find({
      where: { venue: { id: venueId } },
      relations: ['venue', 'user'],
    });
  }

  async findByRole(role: StaffRole) {
    return this.staffMemberRepository.find({
      where: { role },
      relations: ['venue'],
    });
  }

  async findActiveStaff(venueId?: number) {
    const query = this.staffMemberRepository
      .createQueryBuilder('staffMember')
      .leftJoinAndSelect('staffMember.venue', 'venue')
      .leftJoinAndSelect('staffMember.user', 'user')
      .where('staffMember.isActive = :isActive', { isActive: true });

    if (venueId) {
      query.andWhere('venue.id = :venueId', { venueId });
    }

    return query.getMany();
  }

  async getStaffBySalaryRange(venueId: number, minSalary: number, maxSalary: number) {
    return this.staffMemberRepository
      .createQueryBuilder('staffMember')
      .leftJoinAndSelect('staffMember.venue', 'venue')
      .where('venue.id = :venueId', { venueId })
      .andWhere('staffMember.salary BETWEEN :minSalary AND :maxSalary', { minSalary, maxSalary })
      .getMany();
  }

  async getTotalSalaryByVenue(venueId: number) {
    const result = await this.staffMemberRepository
      .createQueryBuilder('staffMember')
      .select('SUM(staffMember.salary)', 'total')
      .where('staffMember.venue.id = :venueId', { venueId })
      .andWhere('staffMember.isActive = :isActive', { isActive: true })
      .getRawOne();
    return result?.total || 0;
  }

  async getStaffCountByRole(venueId: number) {
    return this.staffMemberRepository
      .createQueryBuilder('staffMember')
      .select([
        'staffMember.role',
        'COUNT(staffMember.id) as count'
      ])
      .where('staffMember.venue.id = :venueId', { venueId })
      .andWhere('staffMember.isActive = :isActive', { isActive: true })
      .groupBy('staffMember.role')
      .getRawMany();
  }
}
