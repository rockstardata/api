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
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_permission_entity_1 = require("../entities/user-permission.entity");
const check_permissions_decorator_1 = require("../decorators/check-permissions.decorator");
let PermissionsGuard = class PermissionsGuard {
    reflector;
    permissionRepository;
    constructor(reflector, permissionRepository) {
        this.reflector = reflector;
        this.permissionRepository = permissionRepository;
    }
    async canActivate(context) {
        const requiredPermission = this.reflector.get(check_permissions_decorator_1.PERMISSIONS_KEY, context.getHandler());
        if (!requiredPermission) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const resourceId = parseInt(request.params[requiredPermission.resourceIdParam], 10);
        const hasPermission = await this.permissionRepository.findOneBy({
            user: { id: user.id },
            permissionType: requiredPermission.permission,
            resourceType: requiredPermission.resource,
            resourceId: resourceId,
        });
        return !!hasPermission;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_permission_entity_1.UserPermission)),
    __metadata("design:paramtypes", [core_1.Reflector,
        typeorm_2.Repository])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map