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
const passport_1 = require("@nestjs/passport");
const check_permissions_decorator_1 = require("../auth/decorators/check-permissions.decorator");
const permission_type_enum_1 = require("../auth/enums/permission-type.enum");
const resource_type_enum_1 = require("../auth/enums/resource-type.enum");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const income_service_1 = require("./income.service");
let IncomeController = class IncomeController {
    incomeService;
    constructor(incomeService) {
        this.incomeService = incomeService;
    }
    findIncomeByOrganization(orgId) {
        return this.incomeService.findByOrganization(orgId);
    }
};
exports.IncomeController = IncomeController;
__decorate([
    (0, common_1.Get)('organization/:orgId'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard),
    (0, check_permissions_decorator_1.CheckPermissions)(permission_type_enum_1.PermissionType.ViewIncome, resource_type_enum_1.ResourceType.Organization, 'orgId'),
    __param(0, (0, common_1.Param)('orgId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IncomeController.prototype, "findIncomeByOrganization", null);
exports.IncomeController = IncomeController = __decorate([
    (0, common_1.Controller)('income'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [income_service_1.IncomeService])
], IncomeController);
//# sourceMappingURL=income.controller.js.map