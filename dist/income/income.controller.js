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
exports.IncomeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const income_service_1 = require("./income.service");
const create_income_dto_1 = require("./dto/create-income.dto");
const update_income_dto_1 = require("./dto/update-income.dto");
const income_entity_1 = require("./entities/income.entity");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../role/enums/role.enum");
let IncomeController = class IncomeController {
    incomeService;
    constructor(incomeService) {
        this.incomeService = incomeService;
    }
    async create(createIncomeDto, req) {
        return this.incomeService.create(createIncomeDto, req.user.id);
    }
    async findAll(venueId, category) {
        return this.incomeService.findAll(venueId ? +venueId : undefined, category);
    }
    async findByVenue(venueId) {
        return this.incomeService.findByVenue(+venueId);
    }
    async findByCategory(category) {
        return this.incomeService.findByCategory(category);
    }
    async findByStatus(status) {
        return this.incomeService.findByStatus(status);
    }
    async getPendingIncome(venueId) {
        return this.incomeService.getPendingIncome(venueId ? +venueId : undefined);
    }
    async getTotalIncome(venueId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.incomeService.getTotalIncomeByVenue(+venueId, start, end);
    }
    async findOne(id) {
        return this.incomeService.findOne(+id);
    }
    async update(id, updateIncomeDto, req) {
        return this.incomeService.update(+id, updateIncomeDto, req.user.id);
    }
    async markAsReceived(id, req) {
        return this.incomeService.markAsReceived(+id, req.user.id);
    }
    async remove(id) {
        return this.incomeService.remove(+id);
    }
    async getIncomeCategories() {
        return Object.values(income_entity_1.IncomeCategory);
    }
    async getIncomeStatuses() {
        return Object.values(income_entity_1.IncomeStatus);
    }
};
exports.IncomeController = IncomeController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new income' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Income created successfully',
        type: income_entity_1.Income,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_income_dto_1.CreateIncomeDto, Object]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all income' }),
    (0, swagger_1.ApiQuery)({
        name: 'venueId',
        required: false,
        description: 'Filter by venue ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        description: 'Filter by income category',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Income retrieved successfully',
        type: [income_entity_1.Income],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('venueId')),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('venue/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get income by venue' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Income retrieved successfully',
        type: [income_entity_1.Income],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "findByVenue", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get income by category' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Income retrieved successfully',
        type: [income_entity_1.Income],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get income by status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Income retrieved successfully',
        type: [income_entity_1.Income],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending income' }),
    (0, swagger_1.ApiQuery)({
        name: 'venueId',
        required: false,
        description: 'Filter by venue ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pending income retrieved successfully',
        type: [income_entity_1.Income],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "getPendingIncome", null);
__decorate([
    (0, common_1.Get)('total/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total income by venue' }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date (YYYY-MM-DD)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Total income calculated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "getTotalIncome", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get income by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Income retrieved successfully',
        type: income_entity_1.Income,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Income not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Update income' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Income updated successfully',
        type: income_entity_1.Income,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Income not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_income_dto_1.UpdateIncomeDto, Object]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/mark-received'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Mark income as received' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Income marked as received successfully',
        type: income_entity_1.Income,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Income not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "markAsReceived", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete income' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Income deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Income not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('categories/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all income categories' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Income categories retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "getIncomeCategories", null);
__decorate([
    (0, common_1.Get)('statuses/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all income statuses' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Income statuses retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncomeController.prototype, "getIncomeStatuses", null);
exports.IncomeController = IncomeController = __decorate([
    (0, swagger_1.ApiTags)('income'),
    (0, common_1.Controller)('income'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [income_service_1.IncomeService])
], IncomeController);
//# sourceMappingURL=income.controller.js.map