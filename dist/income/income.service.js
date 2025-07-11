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
exports.IncomeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const income_entity_1 = require("./entities/income.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const sale_entity_1 = require("../sales/entities/sale.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sync_service_1 = require("../database/sync.service");
let IncomeService = class IncomeService {
    incomeRepository;
    venueRepository;
    saleRepository;
    userRepository;
    syncService;
    constructor(incomeRepository, venueRepository, saleRepository, userRepository, syncService) {
        this.incomeRepository = incomeRepository;
        this.venueRepository = venueRepository;
        this.saleRepository = saleRepository;
        this.userRepository = userRepository;
        this.syncService = syncService;
    }
    async create(createIncomeDto, userId) {
        const venue = await this.venueRepository.findOne({
            where: { id: createIncomeDto.venueId },
        });
        if (!venue) {
            throw new common_1.NotFoundException('Venue not found');
        }
        const income = this.incomeRepository.create({
            ...createIncomeDto,
            venue,
            createdBy: { id: userId },
            date: new Date(createIncomeDto.date),
            dueDate: createIncomeDto.dueDate ? new Date(createIncomeDto.dueDate) : null,
        });
        if (createIncomeDto.saleId) {
            const sale = await this.saleRepository.findOne({
                where: { id: createIncomeDto.saleId },
            });
            if (sale) {
                income.sale = sale;
            }
        }
        if (createIncomeDto.receivedById) {
            const receivedBy = await this.userRepository.findOne({
                where: { id: createIncomeDto.receivedById },
            });
            if (receivedBy) {
                income.receivedBy = receivedBy;
            }
        }
        const savedIncome = await this.incomeRepository.save(income);
        this.syncService.syncEntity('Income', 'create', savedIncome).catch(error => {
            console.error('Failed to sync income creation to external DB:', error);
        });
        return savedIncome;
    }
    async findAll(venueId, category) {
        const query = this.incomeRepository.createQueryBuilder('income')
            .leftJoinAndSelect('income.venue', 'venue')
            .leftJoinAndSelect('income.sale', 'sale')
            .leftJoinAndSelect('income.createdBy', 'createdBy')
            .leftJoinAndSelect('income.receivedBy', 'receivedBy');
        if (venueId) {
            query.where('venue.id = :venueId', { venueId });
        }
        if (category) {
            query.andWhere('income.category = :category', { category });
        }
        return query.getMany();
    }
    async findOne(id) {
        const income = await this.incomeRepository.findOne({
            where: { id },
            relations: ['venue', 'sale', 'createdBy', 'receivedBy'],
        });
        if (!income) {
            throw new common_1.NotFoundException(`Income with ID ${id} not found`);
        }
        return income;
    }
    async update(id, updateIncomeDto, userId) {
        const income = await this.findOne(id);
        if (updateIncomeDto.venueId) {
            const venue = await this.venueRepository.findOne({
                where: { id: updateIncomeDto.venueId },
            });
            if (venue) {
                income.venue = venue;
            }
        }
        if (updateIncomeDto.saleId) {
            const sale = await this.saleRepository.findOne({
                where: { id: updateIncomeDto.saleId },
            });
            if (sale) {
                income.sale = sale;
            }
        }
        if (updateIncomeDto.receivedById) {
            const receivedBy = await this.userRepository.findOne({
                where: { id: updateIncomeDto.receivedById },
            });
            if (receivedBy) {
                income.receivedBy = receivedBy;
            }
        }
        if (updateIncomeDto.date) {
            income.date = new Date(updateIncomeDto.date);
        }
        if (updateIncomeDto.dueDate) {
            income.dueDate = new Date(updateIncomeDto.dueDate);
        }
        Object.assign(income, updateIncomeDto);
        const updatedIncome = await this.incomeRepository.save(income);
        this.syncService.syncEntity('Income', 'update', updatedIncome).catch(error => {
            console.error('Failed to sync income update to external DB:', error);
        });
        return updatedIncome;
    }
    async remove(id) {
        const income = await this.findOne(id);
        await this.incomeRepository.remove(income);
        this.syncService.syncEntity('Income', 'delete', { id }).catch(error => {
            console.error('Failed to sync income deletion to external DB:', error);
        });
    }
    async findByVenue(venueId) {
        return this.incomeRepository.find({
            where: { venue: { id: venueId } },
            relations: ['venue', 'sale', 'createdBy', 'receivedBy'],
        });
    }
    async findByCategory(category) {
        return this.incomeRepository.find({
            where: { category },
            relations: ['venue'],
        });
    }
    async findByStatus(status) {
        return this.incomeRepository.find({
            where: { status },
            relations: ['venue'],
        });
    }
    async getTotalIncomeByVenue(venueId, startDate, endDate) {
        const query = this.incomeRepository
            .createQueryBuilder('income')
            .select('SUM(income.amount)', 'total')
            .where('income.venue.id = :venueId', { venueId });
        if (startDate && endDate) {
            query.andWhere('income.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        }
        const result = await query.getRawOne();
        return result?.total || 0;
    }
    async getPendingIncome(venueId) {
        const query = this.incomeRepository
            .createQueryBuilder('income')
            .leftJoinAndSelect('income.venue', 'venue')
            .where('income.status = :status', { status: 'pending' });
        if (venueId) {
            query.andWhere('venue.id = :venueId', { venueId });
        }
        return query.getMany();
    }
    async markAsReceived(id, userId) {
        const income = await this.findOne(id);
        income.status = income_entity_1.IncomeStatus.RECEIVED;
        income.receivedBy = { id: userId };
        return this.incomeRepository.save(income);
    }
};
exports.IncomeService = IncomeService;
exports.IncomeService = IncomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(income_entity_1.Income)),
    __param(1, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(2, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sync_service_1.SyncService])
], IncomeService);
//# sourceMappingURL=income.service.js.map