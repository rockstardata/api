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
exports.KpisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const kpi_entity_1 = require("./entities/kpi.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sync_service_1 = require("../database/sync.service");
let KpisService = class KpisService {
    kpiRepository;
    venueRepository;
    userRepository;
    syncService;
    constructor(kpiRepository, venueRepository, userRepository, syncService) {
        this.kpiRepository = kpiRepository;
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.syncService = syncService;
    }
    async create(createKpiDto, userId) {
        const venue = await this.venueRepository.findOne({
            where: { id: createKpiDto.venueId },
        });
        if (!venue) {
            throw new common_1.NotFoundException('Venue not found');
        }
        const kpi = this.kpiRepository.create({
            ...createKpiDto,
            venue,
            createdBy: { id: userId },
            startDate: new Date(createKpiDto.startDate),
            endDate: new Date(createKpiDto.endDate),
        });
        if (createKpiDto.responsiblePersonId) {
            const responsiblePerson = await this.userRepository.findOne({
                where: { id: createKpiDto.responsiblePersonId },
            });
            if (responsiblePerson) {
                kpi.responsiblePerson = responsiblePerson;
            }
        }
        if (createKpiDto.actualValue && createKpiDto.targetValue) {
            kpi.percentage = (createKpiDto.actualValue / createKpiDto.targetValue) * 100;
        }
        const savedKpi = await this.kpiRepository.save(kpi);
        this.syncService.syncEntity('Kpi', 'create', savedKpi).catch(error => {
            console.error('Failed to sync kpi creation to external DB:', error);
        });
        return savedKpi;
    }
    async findAll(venueId, type) {
        const query = this.kpiRepository.createQueryBuilder('kpi')
            .leftJoinAndSelect('kpi.venue', 'venue')
            .leftJoinAndSelect('kpi.createdBy', 'createdBy')
            .leftJoinAndSelect('kpi.responsiblePerson', 'responsiblePerson');
        if (venueId) {
            query.where('venue.id = :venueId', { venueId });
        }
        if (type) {
            query.andWhere('kpi.type = :type', { type });
        }
        return query.getMany();
    }
    async findOne(id) {
        const kpi = await this.kpiRepository.findOne({
            where: { id },
            relations: ['venue', 'createdBy', 'responsiblePerson'],
        });
        if (!kpi) {
            throw new common_1.NotFoundException(`KPI with ID ${id} not found`);
        }
        return kpi;
    }
    async update(id, updateKpiDto, userId) {
        const kpi = await this.findOne(id);
        if (updateKpiDto.venueId) {
            const venue = await this.venueRepository.findOne({
                where: { id: updateKpiDto.venueId },
            });
            if (venue) {
                kpi.venue = venue;
            }
        }
        if (updateKpiDto.responsiblePersonId) {
            const responsiblePerson = await this.userRepository.findOne({
                where: { id: updateKpiDto.responsiblePersonId },
            });
            if (responsiblePerson) {
                kpi.responsiblePerson = responsiblePerson;
            }
        }
        if (updateKpiDto.startDate) {
            kpi.startDate = new Date(updateKpiDto.startDate);
        }
        if (updateKpiDto.endDate) {
            kpi.endDate = new Date(updateKpiDto.endDate);
        }
        Object.assign(kpi, updateKpiDto);
        if (kpi.actualValue && kpi.targetValue) {
            kpi.percentage = (kpi.actualValue / kpi.targetValue) * 100;
        }
        const updatedKpi = await this.kpiRepository.save(kpi);
        this.syncService.syncEntity('Kpi', 'update', updatedKpi).catch(error => {
            console.error('Failed to sync kpi update to external DB:', error);
        });
        return updatedKpi;
    }
    async remove(id) {
        const kpi = await this.findOne(id);
        await this.kpiRepository.remove(kpi);
        this.syncService.syncEntity('Kpi', 'delete', { id }).catch(error => {
            console.error('Failed to sync kpi deletion to external DB:', error);
        });
    }
    async findByVenue(venueId) {
        return this.kpiRepository.find({
            where: { venue: { id: venueId } },
            relations: ['venue', 'createdBy', 'responsiblePerson'],
        });
    }
    async findByType(type) {
        return this.kpiRepository.find({
            where: { type },
            relations: ['venue'],
        });
    }
    async findByPeriod(period) {
        return this.kpiRepository.find({
            where: { period },
            relations: ['venue'],
        });
    }
    async updateActualValue(id, actualValue) {
        const kpi = await this.findOne(id);
        kpi.actualValue = actualValue;
        kpi.percentage = (actualValue / kpi.targetValue) * 100;
        return this.kpiRepository.save(kpi);
    }
    async getKpiPerformance(venueId, type) {
        const query = this.kpiRepository
            .createQueryBuilder('kpi')
            .select([
            'kpi.type',
            'AVG(kpi.percentage) as avgPercentage',
            'COUNT(kpi.id) as totalKpis',
            'SUM(CASE WHEN kpi.percentage >= 100 THEN 1 ELSE 0 END) as achievedKpis'
        ])
            .where('kpi.venue.id = :venueId', { venueId });
        if (type) {
            query.andWhere('kpi.type = :type', { type });
        }
        query.groupBy('kpi.type');
        return query.getRawMany();
    }
    async getOverdueKpis(venueId) {
        const query = this.kpiRepository
            .createQueryBuilder('kpi')
            .leftJoinAndSelect('kpi.venue', 'venue')
            .where('kpi.endDate < :today', { today: new Date() })
            .andWhere('kpi.percentage < 100');
        if (venueId) {
            query.andWhere('venue.id = :venueId', { venueId });
        }
        return query.getMany();
    }
    async getTopPerformers(venueId, limit = 5) {
        return this.kpiRepository
            .createQueryBuilder('kpi')
            .leftJoinAndSelect('kpi.venue', 'venue')
            .where('kpi.venue.id = :venueId', { venueId })
            .orderBy('kpi.percentage', 'DESC')
            .limit(limit)
            .getMany();
    }
};
exports.KpisService = KpisService;
exports.KpisService = KpisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kpi_entity_1.Kpi)),
    __param(1, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sync_service_1.SyncService])
], KpisService);
//# sourceMappingURL=kpis.service.js.map