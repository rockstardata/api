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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const permissions_service_1 = require("./permissions.service");
const assign_permission_dto_1 = require("./dto/assign-permission.dto");
const permission_type_enum_1 = require("./enums/permission-type.enum");
const roles_decorator_1 = require("./decorators/roles.decorator");
const role_enum_1 = require("../role/enums/role.enum");
const roles_guard_1 = require("./guards/roles.guard");
const passport_1 = require("@nestjs/passport");
let PermissionsController = class PermissionsController {
    permissionsService;
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    assign(assignPermissionDto) {
        return this.permissionsService.assign(assignPermissionDto);
    }
    assignSalesPermissionToOrganization(organizationId, userId, permissionType) {
        const permission = permissionType
            ? permissionType
            : permission_type_enum_1.PermissionType.ViewSales;
        return this.permissionsService.assignSalesPermissionToOrganization(+userId, +organizationId, permission);
    }
    assignSalesPermissionToBusiness(businessId, userId, permissionType) {
        const permission = permissionType
            ? permissionType
            : permission_type_enum_1.PermissionType.ViewSales;
        return this.permissionsService.assignSalesPermissionToBusiness(+userId, +businessId, permission);
    }
    assignSalesPermissionToVenue(venueId, userId, permissionType) {
        const permission = permissionType
            ? permissionType
            : permission_type_enum_1.PermissionType.ViewSales;
        return this.permissionsService.assignSalesPermissionToVenue(+userId, +venueId, permission);
    }
    getUserPermissions(userId) {
        return this.permissionsService.getUserPermissions(+userId);
    }
    checkPermission(userId, permissionType, resourceType, resourceId) {
        return this.permissionsService.hasPermission(+userId, permissionType, resourceType, +resourceId);
    }
    removePermission(userId, permissionType, resourceType, resourceId) {
        return this.permissionsService.removePermission(+userId, permissionType, resourceType, +resourceId);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_permission_dto_1.AssignPermissionDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "assign", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, common_1.Post)('sales/organization/:organizationId/user/:userId'),
    __param(0, (0, common_1.Param)('organizationId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Query)('permissionType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "assignSalesPermissionToOrganization", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, common_1.Post)('sales/business/:businessId/user/:userId'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Query)('permissionType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "assignSalesPermissionToBusiness", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, common_1.Post)('sales/venue/:venueId/user/:userId'),
    __param(0, (0, common_1.Param)('venueId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Query)('permissionType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "assignSalesPermissionToVenue", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getUserPermissions", null);
__decorate([
    (0, common_1.Get)('check/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('permissionType')),
    __param(2, (0, common_1.Query)('resourceType')),
    __param(3, (0, common_1.Query)('resourceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "checkPermission", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SuperAdmin),
    (0, common_1.Delete)('remove/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('permissionType')),
    __param(2, (0, common_1.Query)('resourceType')),
    __param(3, (0, common_1.Query)('resourceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "removePermission", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map