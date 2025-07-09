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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organization_entity_1 = require("../organization/entities/organization.entity");
const user_entity_1 = require("../users/entities/user.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const business_entity_1 = require("../business/entities/business.entity");
const typeorm_2 = require("typeorm");
const user_permission_entity_1 = require("./entities/user-permission.entity");
const resource_type_enum_1 = require("./enums/resource-type.enum");
const permission_type_enum_1 = require("./enums/permission-type.enum");
let PermissionsService = class PermissionsService {
    permissionRepository;
    userRepository;
    organizationRepository;
    venueRepository;
    businessRepository;
    constructor(permissionRepository, userRepository, organizationRepository, venueRepository, businessRepository) {
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.venueRepository = venueRepository;
        this.businessRepository = businessRepository;
    }
    async assign(assignPermissionDto) {
        const { userId, resourceId, resourceType } = assignPermissionDto;
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        if (resourceType === resource_type_enum_1.ResourceType.Organization) {
            const org = await this.organizationRepository.findOneBy({
                id: resourceId,
            });
            if (!org)
                throw new common_1.NotFoundException(`Organization with ID ${resourceId} not found`);
        }
        else if (resourceType === resource_type_enum_1.ResourceType.Venue) {
            const venue = await this.venueRepository.findOneBy({ id: resourceId });
            if (!venue)
                throw new common_1.NotFoundException(`Venue with ID ${resourceId} not found`);
        }
        else if (resourceType === resource_type_enum_1.ResourceType.Business) {
            const business = await this.businessRepository.findOneBy({ id: resourceId });
            if (!business)
                throw new common_1.NotFoundException(`Business with ID ${resourceId} not found`);
        }
        const existingPermission = await this.permissionRepository.findOneBy({
            user: { id: userId },
            permissionType: assignPermissionDto.permissionType,
            resourceType: resourceType,
            resourceId: resourceId,
        });
        if (existingPermission) {
            throw new common_1.BadRequestException('Permission already exists for this user and resource.');
        }
        const permission = this.permissionRepository.create({
            ...assignPermissionDto,
            user: { id: userId },
        });
        return this.permissionRepository.save(permission);
    }
    async assignSalesPermissionToOrganization(userId, organizationId, permissionType = permission_type_enum_1.PermissionType.ViewSales) {
        return this.assign({
            userId,
            resourceId: organizationId,
            resourceType: resource_type_enum_1.ResourceType.Organization,
            permissionType,
        });
    }
    async assignSalesPermissionToBusiness(userId, businessId, permissionType = permission_type_enum_1.PermissionType.ViewSales) {
        return this.assign({
            userId,
            resourceId: businessId,
            resourceType: resource_type_enum_1.ResourceType.Business,
            permissionType,
        });
    }
    async assignSalesPermissionToVenue(userId, venueId, permissionType = permission_type_enum_1.PermissionType.ViewSales) {
        return this.assign({
            userId,
            resourceId: venueId,
            resourceType: resource_type_enum_1.ResourceType.Venue,
            permissionType,
        });
    }
    async getUserPermissions(userId) {
        return await this.permissionRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }
    async hasPermission(userId, permissionType, resourceType, resourceId) {
        const permission = await this.permissionRepository.findOneBy({
            user: { id: userId },
            permissionType,
            resourceType,
            resourceId,
        });
        return !!permission;
    }
    async removePermission(userId, permissionType, resourceType, resourceId) {
        const permission = await this.permissionRepository.findOneBy({
            user: { id: userId },
            permissionType,
            resourceType,
            resourceId,
        });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        await this.permissionRepository.remove(permission);
        return { message: 'Permission removed successfully' };
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_permission_entity_1.UserPermission)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(3, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(4, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map