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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("./entities/sale.entity");
const permissions_service_1 = require("../auth/permissions.service");
const permission_type_enum_1 = require("../auth/enums/permission-type.enum");
const resource_type_enum_1 = require("../auth/enums/resource-type.enum");
const ticket_entity_1 = require("../tickets/entities/ticket.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const business_entity_1 = require("../business/entities/business.entity");
let SalesService = class SalesService {
    saleRepository;
    ticketRepository;
    venueRepository;
    businessRepository;
    permissionsService;
    constructor(saleRepository, ticketRepository, venueRepository, businessRepository, permissionsService) {
        this.saleRepository = saleRepository;
        this.ticketRepository = ticketRepository;
        this.venueRepository = venueRepository;
        this.businessRepository = businessRepository;
        this.permissionsService = permissionsService;
    }
    async create(createSaleDto, userId) {
        const saleData = {
            ...createSaleDto,
        };
        if (userId) {
            saleData.createdBy = { id: userId };
        }
        if (createSaleDto.ticketId) {
            const ticket = await this.ticketRepository.findOne({
                where: { id: createSaleDto.ticketId },
                relations: ['venue', 'business'],
            });
            if (!ticket) {
                throw new common_1.NotFoundException(`Ticket with ID ${createSaleDto.ticketId} not found`);
            }
            saleData.ticket = { id: createSaleDto.ticketId };
            if (ticket.venue) {
                saleData.venue = { id: ticket.venue.id };
            }
            if (ticket.business) {
                saleData.business = { id: ticket.business.id };
            }
        }
        else if (createSaleDto.venueId) {
            const venue = await this.venueRepository.findOne({
                where: { id: createSaleDto.venueId },
                relations: ['business'],
            });
            if (!venue) {
                throw new common_1.NotFoundException(`Venue with ID ${createSaleDto.venueId} not found`);
            }
            saleData.venue = { id: createSaleDto.venueId };
            if (venue.business) {
                saleData.business = { id: venue.business.id };
            }
        }
        else if (createSaleDto.businessId) {
            const business = await this.businessRepository.findOne({
                where: { id: createSaleDto.businessId },
            });
            if (!business) {
                throw new common_1.NotFoundException(`Business with ID ${createSaleDto.businessId} not found`);
            }
            saleData.business = { id: createSaleDto.businessId };
        }
        const sale = this.saleRepository.create(saleData);
        return await this.saleRepository.save(sale);
    }
    async findAll(userId) {
        if (!userId) {
            return await this.saleRepository.find({
                relations: ['ticket', 'createdBy', 'venue', 'business'],
            });
        }
        const userPermissions = await this.permissionsService.getUserPermissions(userId);
        const salesPermissions = userPermissions.filter(p => p.permissionType === permission_type_enum_1.PermissionType.ViewSales);
        if (salesPermissions.length === 0) {
            return await this.findByUser(userId);
        }
        const queryBuilder = this.saleRepository.createQueryBuilder('sale')
            .leftJoinAndSelect('sale.ticket', 'ticket')
            .leftJoinAndSelect('sale.createdBy', 'createdBy')
            .leftJoinAndSelect('sale.venue', 'venue')
            .leftJoinAndSelect('sale.business', 'business');
        const conditions = [];
        const parameters = {};
        for (const permission of salesPermissions) {
            if (permission.resourceType === resource_type_enum_1.ResourceType.Organization) {
                conditions.push('business.organizationId = :orgId');
                parameters['orgId'] = permission.resourceId;
            }
            else if (permission.resourceType === resource_type_enum_1.ResourceType.Business) {
                conditions.push('sale.businessId = :businessId');
                parameters['businessId'] = permission.resourceId;
            }
            else if (permission.resourceType === resource_type_enum_1.ResourceType.Venue) {
                conditions.push('sale.venueId = :venueId');
                parameters['venueId'] = permission.resourceId;
            }
        }
        if (conditions.length > 0) {
            queryBuilder.where(`(${conditions.join(' OR ')})`, parameters);
        }
        return await queryBuilder.getMany();
    }
    async findOne(id, userId) {
        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['ticket', 'createdBy', 'venue', 'business'],
        });
        if (!sale) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        if (userId && !(await this.canAccessSale(userId, sale))) {
            throw new common_1.ForbiddenException('You do not have permission to access this sale');
        }
        return sale;
    }
    async update(id, updateSaleDto, userId) {
        const sale = await this.findOne(id, userId);
        if (userId && !(await this.hasUpdatePermission(userId, sale))) {
            throw new common_1.ForbiddenException('You do not have permission to update this sale');
        }
        Object.assign(sale, updateSaleDto);
        return await this.saleRepository.save(sale);
    }
    async remove(id, userId) {
        const sale = await this.findOne(id, userId);
        if (userId && !(await this.hasDeletePermission(userId, sale))) {
            throw new common_1.ForbiddenException('You do not have permission to delete this sale');
        }
        await this.saleRepository.remove(sale);
    }
    async findByBusiness(businessId, userId) {
        if (userId && !(await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Business, businessId))) {
            throw new common_1.ForbiddenException('You do not have permission to view sales for this business');
        }
        return await this.saleRepository.find({
            where: { business: { id: businessId } },
            relations: ['ticket', 'createdBy', 'venue', 'business'],
        });
    }
    async findByVenue(venueId, userId) {
        if (userId && !(await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Venue, venueId))) {
            throw new common_1.ForbiddenException('You do not have permission to view sales for this venue');
        }
        return await this.saleRepository.find({
            where: { venue: { id: venueId } },
            relations: ['ticket', 'createdBy', 'venue', 'business'],
        });
    }
    async findByUser(userId) {
        return await this.saleRepository.find({
            where: { createdBy: { id: userId } },
            relations: ['ticket', 'createdBy', 'venue', 'business'],
        });
    }
    async getSalesSummary(businessId, venueId, userId) {
        const queryBuilder = this.saleRepository.createQueryBuilder('sale');
        if (businessId) {
            if (userId && !(await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Business, businessId))) {
                throw new common_1.ForbiddenException('You do not have permission to view sales summary for this business');
            }
            queryBuilder.where('sale.businessId = :businessId', { businessId });
        }
        if (venueId) {
            if (userId && !(await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Venue, venueId))) {
                throw new common_1.ForbiddenException('You do not have permission to view sales summary for this venue');
            }
            queryBuilder.andWhere('sale.venueId = :venueId', { venueId });
        }
        const totalSales = await queryBuilder.getCount();
        const totalAmount = await queryBuilder
            .select('SUM(sale.totalAmount)', 'total')
            .getRawOne();
        return {
            totalSales,
            totalAmount: parseFloat(totalAmount?.total || '0'),
        };
    }
    async canAccessSale(userId, sale) {
        if (sale.createdBy?.id === userId) {
            return true;
        }
        if (sale.business?.organization?.id) {
            if (await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Organization, sale.business.organization.id)) {
                return true;
            }
        }
        if (sale.business?.id) {
            if (await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Business, sale.business.id)) {
                return true;
            }
        }
        if (sale.venue?.id) {
            if (await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Venue, sale.venue.id)) {
                return true;
            }
        }
        return false;
    }
    async hasUpdatePermission(userId, sale) {
        return await this.canAccessSale(userId, sale);
    }
    async hasDeletePermission(userId, sale) {
        return await this.canAccessSale(userId, sale);
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(2, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __param(3, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        permissions_service_1.PermissionsService])
], SalesService);
//# sourceMappingURL=sales.service.js.map