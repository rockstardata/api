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
exports.CostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cost_entity_1 = require("./entities/cost.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sync_service_1 = require("../database/sync.service");
let CostsService = class CostsService {
    costRepository;
    venueRepository;
    userRepository;
    syncService;
    constructor(costRepository, venueRepository, userRepository, syncService) {
        this.costRepository = costRepository;
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.syncService = syncService;
    }
    async create(createCostDto, userId) {
        const venue = await this.venueRepository.findOne({
            where: { id: createCostDto.venueId },
        });
        if (!venue) {
            throw new common_1.NotFoundException('Venue not found');
        }
        const cost = this.costRepository.create({
            ...createCostDto,
            venue,
            createdBy: { id: userId },
            date: new Date(createCostDto.date),
            dueDate: createCostDto.dueDate ? new Date(createCostDto.dueDate) : null,
        });
        if (createCostDto.approvedById) {
            const approvedBy = await this.userRepository.findOne({
                where: { id: createCostDto.approvedById },
            });
            if (approvedBy) {
                cost.approvedBy = approvedBy;
            }
        }
        const savedCost = await this.costRepository.save(cost);
        this.syncService.syncEntity('Cost', 'create', savedCost).catch(error => {
            console.error('Failed to sync cost creation to external DB:', error);
        });
        return savedCost;
    }
    async findAll(venueId, category) {
        const query = this.costRepository.createQueryBuilder('cost')
            .leftJoinAndSelect('cost.venue', 'venue')
            .leftJoinAndSelect('cost.createdBy', 'createdBy')
            .leftJoinAndSelect('cost.approvedBy', 'approvedBy');
        if (venueId) {
            query.where('venue.id = :venueId', { venueId });
        }
        if (category) {
            query.andWhere('cost.category = :category', { category });
        }
        return query.getMany();
    }
    async findOne(id) {
        const cost = await this.costRepository.findOne({
            where: { id },
            relations: ['venue', 'createdBy', 'approvedBy'],
        });
        if (!cost) {
            throw new common_1.NotFoundException(`Cost with ID ${id} not found`);
        }
        return cost;
    }
    async update(id, updateCostDto, userId) {
        const cost = await this.findOne(id);
        if (updateCostDto.venueId) {
            const venue = await this.venueRepository.findOne({
                where: { id: updateCostDto.venueId },
            });
            if (venue) {
                cost.venue = venue;
            }
        }
        if (updateCostDto.approvedById) {
            const approvedBy = await this.userRepository.findOne({
                where: { id: updateCostDto.approvedById },
            });
            if (approvedBy) {
                cost.approvedBy = approvedBy;
            }
        }
        if (updateCostDto.date) {
            cost.date = new Date(updateCostDto.date);
        }
        if (updateCostDto.dueDate) {
            cost.dueDate = new Date(updateCostDto.dueDate);
        }
        Object.assign(cost, updateCostDto);
        const updatedCost = await this.costRepository.save(cost);
        this.syncService.syncEntity('Cost', 'update', updatedCost).catch(error => {
            console.error('Failed to sync cost update to external DB:', error);
        });
        return updatedCost;
    }
    async remove(id) {
        const cost = await this.findOne(id);
        await this.costRepository.remove(cost);
        this.syncService.syncEntity('Cost', 'delete', { id }).catch(error => {
            console.error('Failed to sync cost deletion to external DB:', error);
        });
    }
    async findByVenue(venueId) {
        return this.costRepository.find({
            where: { venue: { id: venueId } },
            relations: ['venue', 'createdBy', 'approvedBy'],
        });
    }
    async findByCategory(category) {
        return this.costRepository.find({
            where: { category },
            relations: ['venue'],
        });
    }
    async getTotalCostsByVenue(venueId, startDate, endDate) {
        const query = this.costRepository
            .createQueryBuilder('cost')
            .select('SUM(cost.amount)', 'total')
            .where('cost.venue.id = :venueId', { venueId });
        if (startDate && endDate) {
            query.andWhere('cost.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        const result = await query.getRawOne();
        return result?.total || 0;
    }
    async getUnpaidCosts(venueId) {
        const query = this.costRepository
            .createQueryBuilder('cost')
            .leftJoinAndSelect('cost.venue', 'venue')
            .where('cost.isPaid = :isPaid', { isPaid: false });
        if (venueId) {
            query.andWhere('venue.id = :venueId', { venueId });
        }
        return query.getMany();
    }
    async markAsPaid(id, userId) {
        const cost = await this.findOne(id);
        cost.isPaid = true;
        cost.approvedBy = { id: userId };
        return this.costRepository.save(cost);
    }
};
exports.CostsService = CostsService;
exports.CostsService = CostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cost_entity_1.Cost)),
    __param(1, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sync_service_1.SyncService])
], CostsService);
//# sourceMappingURL=costs.service.js.map