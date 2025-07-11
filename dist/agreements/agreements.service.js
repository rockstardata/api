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
exports.AgreementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agreement_entity_1 = require("./entities/agreement.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sync_service_1 = require("../database/sync.service");
let AgreementsService = class AgreementsService {
    agreementRepository;
    venueRepository;
    userRepository;
    syncService;
    constructor(agreementRepository, venueRepository, userRepository, syncService) {
        this.agreementRepository = agreementRepository;
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.syncService = syncService;
    }
    async create(createAgreementDto, userId) {
        const venue = await this.venueRepository.findOne({
            where: { id: createAgreementDto.venueId },
        });
        if (!venue) {
            throw new common_1.NotFoundException('Venue not found');
        }
        const agreement = this.agreementRepository.create({
            ...createAgreementDto,
            venue,
            createdBy: { id: userId },
            startDate: new Date(createAgreementDto.startDate),
            endDate: new Date(createAgreementDto.endDate),
        });
        if (createAgreementDto.responsiblePersonId) {
            const responsiblePerson = await this.userRepository.findOne({
                where: { id: createAgreementDto.responsiblePersonId },
            });
            if (responsiblePerson) {
                agreement.responsiblePerson = responsiblePerson;
            }
        }
        const savedAgreement = await this.agreementRepository.save(agreement);
        this.syncService.syncEntity('Agreement', 'create', savedAgreement).catch(error => {
            console.error('Failed to sync agreement creation to external DB:', error);
        });
        return savedAgreement;
    }
    async findAll(venueId) {
        const query = this.agreementRepository.createQueryBuilder('agreement')
            .leftJoinAndSelect('agreement.venue', 'venue')
            .leftJoinAndSelect('agreement.createdBy', 'createdBy')
            .leftJoinAndSelect('agreement.responsiblePerson', 'responsiblePerson');
        if (venueId) {
            query.where('venue.id = :venueId', { venueId });
        }
        return query.getMany();
    }
    async findOne(id) {
        const agreement = await this.agreementRepository.findOne({
            where: { id },
            relations: ['venue', 'createdBy', 'responsiblePerson'],
        });
        if (!agreement) {
            throw new common_1.NotFoundException(`Agreement with ID ${id} not found`);
        }
        return agreement;
    }
    async update(id, updateAgreementDto, userId) {
        const agreement = await this.findOne(id);
        if (updateAgreementDto.venueId) {
            const venue = await this.venueRepository.findOne({
                where: { id: updateAgreementDto.venueId },
            });
            if (venue) {
                agreement.venue = venue;
            }
        }
        if (updateAgreementDto.responsiblePersonId) {
            const responsiblePerson = await this.userRepository.findOne({
                where: { id: updateAgreementDto.responsiblePersonId },
            });
            if (responsiblePerson) {
                agreement.responsiblePerson = responsiblePerson;
            }
        }
        if (updateAgreementDto.startDate) {
            agreement.startDate = new Date(updateAgreementDto.startDate);
        }
        if (updateAgreementDto.endDate) {
            agreement.endDate = new Date(updateAgreementDto.endDate);
        }
        Object.assign(agreement, updateAgreementDto);
        const updatedAgreement = await this.agreementRepository.save(agreement);
        this.syncService.syncEntity('Agreement', 'update', updatedAgreement).catch(error => {
            console.error('Failed to sync agreement update to external DB:', error);
        });
        return updatedAgreement;
    }
    async remove(id) {
        const agreement = await this.findOne(id);
        await this.agreementRepository.remove(agreement);
        this.syncService.syncEntity('Agreement', 'delete', { id }).catch(error => {
            console.error('Failed to sync agreement deletion to external DB:', error);
        });
    }
    async findByVenue(venueId) {
        return this.agreementRepository.find({
            where: { venue: { id: venueId } },
            relations: ['venue', 'createdBy', 'responsiblePerson'],
        });
    }
    async findByStatus(status) {
        return this.agreementRepository.find({
            where: { status },
            relations: ['venue'],
        });
    }
    async getExpiringAgreements(days = 30) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return this.agreementRepository
            .createQueryBuilder('agreement')
            .leftJoinAndSelect('agreement.venue', 'venue')
            .where('agreement.endDate <= :date', { date })
            .andWhere('agreement.status = :status', { status: 'active' })
            .getMany();
    }
};
exports.AgreementsService = AgreementsService;
exports.AgreementsService = AgreementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agreement_entity_1.Agreement)),
    __param(1, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sync_service_1.SyncService])
], AgreementsService);
//# sourceMappingURL=agreements.service.js.map