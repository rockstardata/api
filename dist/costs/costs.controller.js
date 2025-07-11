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
exports.CostsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const costs_service_1 = require("./costs.service");
const create_cost_dto_1 = require("./dto/create-cost.dto");
const update_cost_dto_1 = require("./dto/update-cost.dto");
const cost_entity_1 = require("./entities/cost.entity");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../role/enums/role.enum");
let CostsController = class CostsController {
    costsService;
    constructor(costsService) {
        this.costsService = costsService;
    }
    async create(createCostDto, req) {
        return this.costsService.create(createCostDto, req.user.id);
    }
    async findAll(venueId, category) {
        return this.costsService.findAll(venueId ? +venueId : undefined, category);
    }
    async findByVenue(venueId) {
        return this.costsService.findByVenue(+venueId);
    }
    async findByCategory(category) {
        return this.costsService.findByCategory(category);
    }
    async getUnpaidCosts(venueId) {
        return this.costsService.getUnpaidCosts(venueId ? +venueId : undefined);
    }
    async getTotalCosts(venueId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.costsService.getTotalCostsByVenue(+venueId, start, end);
    }
    async findOne(id) {
        return this.costsService.findOne(+id);
    }
    async update(id, updateCostDto, req) {
        return this.costsService.update(+id, updateCostDto, req.user.id);
    }
    async markAsPaid(id, req) {
        return this.costsService.markAsPaid(+id, req.user.id);
    }
    async remove(id) {
        return this.costsService.remove(+id);
    }
    async getCostCategories() {
        return Object.values(cost_entity_1.CostCategory);
    }
    async getCostFrequencies() {
        return Object.values(cost_entity_1.CostFrequency);
    }
};
exports.CostsController = CostsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new cost' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cost created successfully', type: cost_entity_1.Cost }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cost_dto_1.CreateCostDto, Object]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all costs' }),
    (0, swagger_1.ApiQuery)({ name: 'venueId', required: false, description: 'Filter by venue ID' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by cost category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Costs retrieved successfully', type: [cost_entity_1.Cost] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('venueId')),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('venue/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get costs by venue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Costs retrieved successfully', type: [cost_entity_1.Cost] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "findByVenue", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get costs by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Costs retrieved successfully', type: [cost_entity_1.Cost] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('unpaid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unpaid costs' }),
    (0, swagger_1.ApiQuery)({ name: 'venueId', required: false, description: 'Filter by venue ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unpaid costs retrieved successfully', type: [cost_entity_1.Cost] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "getUnpaidCosts", null);
__decorate([
    (0, common_1.Get)('total/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total costs by venue' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Total costs calculated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "getTotalCosts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cost by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cost retrieved successfully', type: cost_entity_1.Cost }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cost not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Update cost' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cost updated successfully', type: cost_entity_1.Cost }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cost not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cost_dto_1.UpdateCostDto, Object]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/mark-paid'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Mark cost as paid' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cost marked as paid successfully', type: cost_entity_1.Cost }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cost not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "markAsPaid", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete cost' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Cost deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cost not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('categories/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all cost categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cost categories retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "getCostCategories", null);
__decorate([
    (0, common_1.Get)('frequencies/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all cost frequencies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cost frequencies retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CostsController.prototype, "getCostFrequencies", null);
exports.CostsController = CostsController = __decorate([
    (0, swagger_1.ApiTags)('costs'),
    (0, common_1.Controller)('costs'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [costs_service_1.CostsService])
], CostsController);
//# sourceMappingURL=costs.controller.js.map