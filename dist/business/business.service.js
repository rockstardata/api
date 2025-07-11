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
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const business_entity_1 = require("./entities/business.entity");
const sync_service_1 = require("../database/sync.service");
let BusinessService = class BusinessService {
    businessRepository;
    syncService;
    constructor(businessRepository, syncService) {
        this.businessRepository = businessRepository;
        this.syncService = syncService;
    }
    async create(createBusinessDto, userId) {
        const businessData = {
            ...createBusinessDto,
        };
        if (userId) {
            businessData.createdBy = { id: userId };
        }
        const business = this.businessRepository.create(businessData);
        const savedBusiness = await this.businessRepository.save(business);
        this.syncService.syncEntity('Business', 'create', savedBusiness).catch(error => {
            console.error('Failed to sync business creation to external DB:', error);
        });
        return savedBusiness;
    }
    async findAll() {
        return await this.businessRepository.find({
            relations: ['company', 'createdBy', 'staffMembers'],
        });
    }
    async findOne(id) {
        const business = await this.businessRepository.findOne({
            where: { id },
            relations: ['company', 'createdBy', 'staffMembers'],
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        return business;
    }
    async update(id, updateBusinessDto) {
        const business = await this.findOne(id);
        Object.assign(business, updateBusinessDto);
        const updatedBusiness = await this.businessRepository.save(business);
        this.syncService.syncEntity('Business', 'update', updatedBusiness).catch(error => {
            console.error('Failed to sync business update to external DB:', error);
        });
        return updatedBusiness;
    }
    async remove(id) {
        const business = await this.findOne(id);
        await this.businessRepository.remove(business);
        this.syncService.syncEntity('Business', 'delete', { id }).catch(error => {
            console.error('Failed to sync business deletion to external DB:', error);
        });
    }
    async findByCompany(companyId) {
        return await this.businessRepository.find({
            where: { company: { id: companyId } },
            relations: ['company', 'createdBy', 'staffMembers'],
        });
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sync_service_1.SyncService])
], BusinessService);
//# sourceMappingURL=business.service.js.map