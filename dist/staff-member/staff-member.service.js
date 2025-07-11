"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffMemberService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_member_entity_1 = require("./entities/staff-member.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sync_service_1 = require("../database/sync.service");
let StaffMemberService = class StaffMemberService {
    staffMemberRepository;
    venueRepository;
    userRepository;
    syncService;
    constructor(staffMemberRepository, venueRepository, userRepository, syncService) {
        this.staffMemberRepository = staffMemberRepository;
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.syncService = syncService;
    }
    async create(createStaffMemberDto, userId) {
        const venue = await this.venueRepository.findOne({
            where: { id: createStaffMemberDto.venueId },
        });
        if (!venue) {
            throw new common_1.NotFoundException('Venue not found');
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
    async findAll(venueId, role) {
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
    async findOne(id) {
        const staffMember = await this.staffMemberRepository.findOne({
            where: { id },
            relations: ['venue', 'user'],
        });
        if (!staffMember) {
            throw new common_1.NotFoundException(`Staff member with ID ${id} not found`);
        }
        return staffMember;
    }
    async update(id, updateStaffMemberDto, userId) {
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
    async remove(id) {
        const staffMember = await this.findOne(id);
        await this.staffMemberRepository.remove(staffMember);
        this.syncService.syncEntity('StaffMember', 'delete', { id }).catch(error => {
            console.error('Failed to sync staff member deletion to external DB:', error);
        });
    }
    async findByVenue(venueId) {
        return this.staffMemberRepository.find({
            where: { venue: { id: venueId } },
            relations: ['venue', 'user'],
        });
    }
    async findByRole(role) {
        return this.staffMemberRepository.find({
            where: { role },
            relations: ['venue'],
        });
    }
    async findActiveStaff(venueId) {
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
    async getStaffBySalaryRange(venueId, minSalary, maxSalary) {
        return this.staffMemberRepository
            .createQueryBuilder('staffMember')
            .leftJoinAndSelect('staffMember.venue', 'venue')
            .where('venue.id = :venueId', { venueId })
            .andWhere('staffMember.salary BETWEEN :minSalary AND :maxSalary', { minSalary, maxSalary })
            .getMany();
    }
    async getTotalSalaryByVenue(venueId) {
        const result = await this.staffMemberRepository
            .createQueryBuilder('staffMember')
            .select('SUM(staffMember.salary)', 'total')
            .where('staffMember.venue.id = :venueId', { venueId })
            .andWhere('staffMember.isActive = :isActive', { isActive: true })
            .getRawOne();
        return result?.total || 0;
    }
    async getStaffCountByRole(venueId) {
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
};
exports.StaffMemberService = StaffMemberService;
exports.StaffMemberService = StaffMemberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_member_entity_1.StaffMember)),
    __param(1, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sync_service_1.SyncService])
], StaffMemberService);
//# sourceMappingURL=staff-member.service.js.map