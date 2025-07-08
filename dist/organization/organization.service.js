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
let OrganizationService = class OrganizationService {
    organizationRepository;
    constructor(organizationRepository) {
        this.organizationRepository = organizationRepository;
    }
    create(createOrganizationDto) {
        const organization = this.organizationRepository.create(createOrganizationDto);
        return this.organizationRepository.save(organization);
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
        return this.organizationRepository.save(organization);
    }
    async remove(id) {
        const organization = await this.findOne(id);
        return this.organizationRepository.remove(organization);
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map