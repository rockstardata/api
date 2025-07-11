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
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_entity_1 = require("./entities/organization.entity");
const organizationUser_entity_1 = require("./entities/organizationUser.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sync_service_1 = require("../database/sync.service");
let OrganizationService = class OrganizationService {
    organizationRepository;
    organizationUserRepository;
    userRepository;
    syncService;
    constructor(organizationRepository, organizationUserRepository, userRepository, syncService) {
        this.organizationRepository = organizationRepository;
        this.organizationUserRepository = organizationUserRepository;
        this.userRepository = userRepository;
        this.syncService = syncService;
    }
    async create(createOrganizationDto) {
        const organization = this.organizationRepository.create(createOrganizationDto);
        const savedOrganization = await this.organizationRepository.save(organization);
        this.syncService.syncEntity('Organization', 'create', savedOrganization).catch(error => {
            console.error('Failed to sync organization creation to external DB:', error);
        });
        return savedOrganization;
    }
    findAll() {
        return this.organizationRepository.find();
    }
    async findOne(id) {
        const organization = await this.organizationRepository.findOneBy({ id });
        if (!organization) {
            throw new common_1.NotFoundException(`Organization with ID "${id}" not found`);
        }
        return organization;
    }
    async update(id, updateOrganizationDto) {
        const organization = await this.organizationRepository.preload({
            id,
            ...updateOrganizationDto,
        });
        if (!organization) {
            throw new common_1.NotFoundException(`Organization with ID "${id}" not found`);
        }
        const updatedOrganization = await this.organizationRepository.save(organization);
        this.syncService.syncEntity('Organization', 'update', updatedOrganization).catch(error => {
            console.error('Failed to sync organization update to external DB:', error);
        });
        return updatedOrganization;
    }
    async remove(id) {
        const organization = await this.findOne(id);
        await this.organizationRepository.remove(organization);
        this.syncService.syncEntity('Organization', 'delete', { id }).catch(error => {
            console.error('Failed to sync organization deletion to external DB:', error);
        });
    }
    async assignUserToOrganization(orgId, userId) {
        const organization = await this.organizationRepository.findOneBy({ id: orgId });
        if (!organization)
            throw new common_1.NotFoundException('Organization not found');
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const existing = await this.organizationUserRepository.findOne({ where: { organization: { id: orgId }, user: { id: userId } } });
        if (existing)
            throw new common_1.BadRequestException('User already assigned to this organization');
        const orgUser = this.organizationUserRepository.create({ organization, user });
        return this.organizationUserRepository.save(orgUser);
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(1, (0, typeorm_1.InjectRepository)(organizationUser_entity_1.OrganizationUser)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sync_service_1.SyncService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map