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
exports.KpisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const kpis_service_1 = require("./kpis.service");
const create_kpi_dto_1 = require("./dto/create-kpi.dto");
const update_kpi_dto_1 = require("./dto/update-kpi.dto");
const kpi_entity_1 = require("./entities/kpi.entity");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../role/enums/role.enum");
let KpisController = class KpisController {
    kpisService;
    constructor(kpisService) {
        this.kpisService = kpisService;
    }
    async create(createKpiDto, req) {
        return this.kpisService.create(createKpiDto, req.user.id);
    }
    async findAll(venueId, type) {
        return this.kpisService.findAll(venueId ? +venueId : undefined, type);
    }
    async findByVenue(venueId) {
        return this.kpisService.findByVenue(+venueId);
    }
    async findByType(type) {
        return this.kpisService.findByType(type);
    }
    async findByPeriod(period) {
        return this.kpisService.findByPeriod(period);
    }
    async getOverdueKpis(venueId) {
        return this.kpisService.getOverdueKpis(venueId ? +venueId : undefined);
    }
    async getKpiPerformance(venueId, type) {
        return this.kpisService.getKpiPerformance(+venueId, type);
    }
    async getTopPerformers(venueId, limit) {
        return this.kpisService.getTopPerformers(+venueId, limit ? +limit : 5);
    }
    async findOne(id) {
        return this.kpisService.findOne(+id);
    }
    async update(id, updateKpiDto, req) {
        return this.kpisService.update(+id, updateKpiDto, req.user.id);
    }
    async updateActualValue(id, actualValue) {
        return this.kpisService.updateActualValue(+id, actualValue);
    }
    async remove(id) {
        return this.kpisService.remove(+id);
    }
    async getKpiTypes() {
        return Object.values(kpi_entity_1.KpiType);
    }
    async getKpiPeriods() {
        return Object.values(kpi_entity_1.KpiPeriod);
    }
};
exports.KpisController = KpisController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new KPI' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'KPI created successfully', type: kpi_entity_1.Kpi }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kpi_dto_1.CreateKpiDto, Object]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPIs' }),
    (0, swagger_1.ApiQuery)({ name: 'venueId', required: false, description: 'Filter by venue ID' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by KPI type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPIs retrieved successfully', type: [kpi_entity_1.Kpi] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('venueId')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('venue/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPIs by venue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPIs retrieved successfully', type: [kpi_entity_1.Kpi] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findByVenue", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPIs by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPIs retrieved successfully', type: [kpi_entity_1.Kpi] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)('period/:period'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPIs by period' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPIs retrieved successfully', type: [kpi_entity_1.Kpi] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findByPeriod", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue KPIs' }),
    (0, swagger_1.ApiQuery)({ name: 'venueId', required: false, description: 'Filter by venue ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overdue KPIs retrieved successfully', type: [kpi_entity_1.Kpi] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "getOverdueKpis", null);
__decorate([
    (0, common_1.Get)('performance/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPI performance by venue' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by KPI type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPI performance calculated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "getKpiPerformance", null);
__decorate([
    (0, common_1.Get)('top-performers/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top performing KPIs' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of top performers (default: 5)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Top performers retrieved successfully', type: [kpi_entity_1.Kpi] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "getTopPerformers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KPI by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPI retrieved successfully', type: kpi_entity_1.Kpi }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'KPI not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Update KPI' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPI updated successfully', type: kpi_entity_1.Kpi }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'KPI not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kpi_dto_1.UpdateKpiDto, Object]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/actual-value'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Update KPI actual value' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPI actual value updated successfully', type: kpi_entity_1.Kpi }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'KPI not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('actualValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "updateActualValue", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete KPI' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'KPI deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'KPI not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('types/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPI types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPI types retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "getKpiTypes", null);
__decorate([
    (0, common_1.Get)('periods/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPI periods' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KPI periods retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KpisController.prototype, "getKpiPeriods", null);
exports.KpisController = KpisController = __decorate([
    (0, swagger_1.ApiTags)('kpis'),
    (0, common_1.Controller)('kpis'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [kpis_service_1.KpisService])
], KpisController);
//# sourceMappingURL=kpis.controller.js.map