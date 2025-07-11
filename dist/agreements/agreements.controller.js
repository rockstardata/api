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
exports.AgreementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agreements_service_1 = require("./agreements.service");
const create_agreement_dto_1 = require("./dto/create-agreement.dto");
const update_agreement_dto_1 = require("./dto/update-agreement.dto");
const agreement_entity_1 = require("./entities/agreement.entity");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../role/enums/role.enum");
let AgreementsController = class AgreementsController {
    agreementsService;
    constructor(agreementsService) {
        this.agreementsService = agreementsService;
    }
    async create(createAgreementDto, req) {
        return this.agreementsService.create(createAgreementDto, req.user.id);
    }
    async findAll(venueId) {
        return this.agreementsService.findAll(venueId ? +venueId : undefined);
    }
    async findByVenue(venueId) {
        return this.agreementsService.findByVenue(+venueId);
    }
    async findByStatus(status) {
        return this.agreementsService.findByStatus(status);
    }
    async getExpiringAgreements(days) {
        return this.agreementsService.getExpiringAgreements(days ? +days : 30);
    }
    async findOne(id) {
        return this.agreementsService.findOne(+id);
    }
    async update(id, updateAgreementDto, req) {
        return this.agreementsService.update(+id, updateAgreementDto, req.user.id);
    }
    async remove(id) {
        return this.agreementsService.remove(+id);
    }
    async getAgreementTypes() {
        return Object.values(agreement_entity_1.AgreementType);
    }
    async getAgreementStatuses() {
        return Object.values(agreement_entity_1.AgreementStatus);
    }
};
exports.AgreementsController = AgreementsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new agreement' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agreement created successfully', type: agreement_entity_1.Agreement }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agreement_dto_1.CreateAgreementDto, Object]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all agreements' }),
    (0, swagger_1.ApiQuery)({ name: 'venueId', required: false, description: 'Filter by venue ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agreements retrieved successfully', type: [agreement_entity_1.Agreement] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('venue/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agreements by venue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agreements retrieved successfully', type: [agreement_entity_1.Agreement] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "findByVenue", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agreements by status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agreements retrieved successfully', type: [agreement_entity_1.Agreement] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('expiring'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agreements expiring soon' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, description: 'Days to look ahead (default: 30)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expiring agreements retrieved successfully', type: [agreement_entity_1.Agreement] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "getExpiringAgreements", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agreement by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agreement retrieved successfully', type: agreement_entity_1.Agreement }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agreement not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Update agreement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agreement updated successfully', type: agreement_entity_1.Agreement }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agreement not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agreement_dto_1.UpdateAgreementDto, Object]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete agreement' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Agreement deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agreement not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('types/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all agreement types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agreement types retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "getAgreementTypes", null);
__decorate([
    (0, common_1.Get)('statuses/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all agreement statuses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agreement statuses retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgreementsController.prototype, "getAgreementStatuses", null);
exports.AgreementsController = AgreementsController = __decorate([
    (0, swagger_1.ApiTags)('agreements'),
    (0, common_1.Controller)('agreements'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [agreements_service_1.AgreementsService])
], AgreementsController);
//# sourceMappingURL=agreements.controller.js.map