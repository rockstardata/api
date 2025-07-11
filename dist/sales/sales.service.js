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
const ticket_entity_1 = require("../tickets/entities/ticket.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const permissions_service_1 = require("../auth/permissions.service");
const permission_type_enum_1 = require("../auth/enums/permission-type.enum");
const resource_type_enum_1 = require("../auth/enums/resource-type.enum");
const sync_service_1 = require("../database/sync.service");
let SalesService = class SalesService {
    saleRepository;
    ticketRepository;
    venueRepository;
    permissionsService;
    syncService;
    constructor(saleRepository, ticketRepository, venueRepository, permissionsService, syncService) {
        this.saleRepository = saleRepository;
        this.ticketRepository = ticketRepository;
        this.venueRepository = venueRepository;
        this.permissionsService = permissionsService;
        this.syncService = syncService;
    }
    async create(createSaleDto, userId) {
        const saleData = {
            productName: createSaleDto.productName,
            quantity: createSaleDto.quantity,
            price: createSaleDto.price,
            totalAmount: createSaleDto.quantity * createSaleDto.price,
            paymentMethod: createSaleDto.paymentMethod || sale_entity_1.PaymentMethod.CASH,
            status: createSaleDto.status || sale_entity_1.SaleStatus.COMPLETED,
            notes: createSaleDto.notes,
            createdBy: userId ? { id: userId } : undefined,
        };
        if (createSaleDto.ticketId) {
            const ticket = await this.ticketRepository.findOne({
                where: { id: createSaleDto.ticketId },
                relations: ['venue'],
            });
            if (!ticket) {
                throw new common_1.NotFoundException(`Ticket with ID ${createSaleDto.ticketId} not found`);
            }
            saleData.ticket = { id: createSaleDto.ticketId };
            if (ticket.venue) {
                saleData.venue = { id: ticket.venue.id };
            }
        }
        else if (createSaleDto.venueId) {
            const venue = await this.venueRepository.findOne({
                where: { id: createSaleDto.venueId },
            });
            if (!venue) {
                throw new common_1.NotFoundException(`Venue with ID ${createSaleDto.venueId} not found`);
            }
            saleData.venue = { id: createSaleDto.venueId };
        }
        const sale = this.saleRepository.create(saleData);
        const savedSale = await this.saleRepository.save(sale);
        this.syncService.syncEntity('Sale', 'create', savedSale).catch(error => {
            console.error('Failed to sync sale creation to external DB:', error);
        });
        return savedSale;
    }
    async findAll(userId) {
        if (!userId) {
            return await this.saleRepository.find({
                relations: ['ticket', 'createdBy', 'venue'],
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
            .leftJoinAndSelect('sale.venue', 'venue');
        const conditions = [];
        const parameters = {};
        for (const permission of salesPermissions) {
            if (permission.resourceType === resource_type_enum_1.ResourceType.Organization) {
                conditions.push('venue.company.organizationId = :orgId');
                parameters['orgId'] = permission.resourceId;
            }
            else if (permission.resourceType === resource_type_enum_1.ResourceType.Company) {
                conditions.push('venue.companyId = :companyId');
                parameters['companyId'] = permission.resourceId;
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
            relations: ['ticket', 'createdBy', 'venue'],
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
        const updatedSale = await this.saleRepository.save(sale);
        this.syncService.syncEntity('Sale', 'update', updatedSale).catch(error => {
            console.error('Failed to sync sale update to external DB:', error);
        });
        return updatedSale;
    }
    async remove(id, userId) {
        const sale = await this.findOne(id, userId);
        if (userId && !(await this.hasDeletePermission(userId, sale))) {
            throw new common_1.ForbiddenException('You do not have permission to delete this sale');
        }
        await this.saleRepository.remove(sale);
        this.syncService.syncEntity('Sale', 'delete', { id }).catch(error => {
            console.error('Failed to sync sale deletion to external DB:', error);
        });
    }
    async findByVenue(venueId, userId) {
        if (userId && !(await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Venue, venueId))) {
            throw new common_1.ForbiddenException('You do not have permission to view sales for this venue');
        }
        return await this.saleRepository.find({
            where: { venue: { id: venueId } },
            relations: ['ticket', 'createdBy', 'venue'],
        });
    }
    async findByUser(userId) {
        return await this.saleRepository.find({
            where: { createdBy: { id: userId } },
            relations: ['ticket', 'createdBy', 'venue'],
        });
    }
    async getSalesSummary(venueId, userId) {
        const queryBuilder = this.saleRepository.createQueryBuilder('sale');
        if (venueId) {
            queryBuilder.where('sale.venueId = :venueId', { venueId });
        }
        const totalSales = await queryBuilder.getCount();
        const totalAmount = await queryBuilder
            .select('SUM(sale.totalAmount)', 'total')
            .getRawOne();
        return {
            totalSales,
            totalAmount: totalAmount?.total || 0,
        };
    }
    async getSalesByDateRange(startDate, endDate, venueId, userId) {
        const queryBuilder = this.saleRepository
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.ticket', 'ticket')
            .leftJoinAndSelect('sale.createdBy', 'createdBy')
            .leftJoinAndSelect('sale.venue', 'venue')
            .where('sale.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
        if (venueId) {
            queryBuilder.andWhere('sale.venueId = :venueId', { venueId });
        }
        return await queryBuilder.getMany();
    }
    async getSalesByPaymentMethod(paymentMethod, venueId, userId) {
        const queryBuilder = this.saleRepository
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.ticket', 'ticket')
            .leftJoinAndSelect('sale.createdBy', 'createdBy')
            .leftJoinAndSelect('sale.venue', 'venue')
            .where('sale.paymentMethod = :paymentMethod', { paymentMethod });
        if (venueId) {
            queryBuilder.andWhere('sale.venueId = :venueId', { venueId });
        }
        return await queryBuilder.getMany();
    }
    async getSalesByStatus(status, venueId, userId) {
        const queryBuilder = this.saleRepository
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.ticket', 'ticket')
            .leftJoinAndSelect('sale.createdBy', 'createdBy')
            .leftJoinAndSelect('sale.venue', 'venue')
            .where('sale.status = :status', { status });
        if (venueId) {
            queryBuilder.andWhere('sale.venueId = :venueId', { venueId });
        }
        return await queryBuilder.getMany();
    }
    async canAccessSale(userId, sale) {
        if (sale.createdBy?.id === userId) {
            return true;
        }
        if (sale.venue?.company?.organization?.id) {
            return await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Organization, sale.venue.company.organization.id);
        }
        if (sale.venue?.company?.id) {
            return await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Company, sale.venue.company.id);
        }
        if (sale.venue?.id) {
            return await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.ViewSales, resource_type_enum_1.ResourceType.Venue, sale.venue.id);
        }
        return false;
    }
    async hasUpdatePermission(userId, sale) {
        return await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.UpdateSales, resource_type_enum_1.ResourceType.Venue, sale.venue?.id);
    }
    async hasDeletePermission(userId, sale) {
        return await this.permissionsService.hasPermission(userId, permission_type_enum_1.PermissionType.DeleteSales, resource_type_enum_1.ResourceType.Venue, sale.venue?.id);
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(2, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        permissions_service_1.PermissionsService,
        sync_service_1.SyncService])
], SalesService);
//# sourceMappingURL=sales.service.js.map