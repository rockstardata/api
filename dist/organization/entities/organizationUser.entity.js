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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationUser = void 0;
const role_entity_1 = require("../../role/entities/role.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
const organization_entity_1 = require("./organization.entity");
let OrganizationUser = class OrganizationUser {
    id;
    user;
    organization;
    role;
};
exports.OrganizationUser = OrganizationUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrganizationUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.organizationUsers, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", user_entity_1.User)
], OrganizationUser.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization, (organization) => organization.organizationUsers, { onDelete: 'CASCADE' }),
    __metadata("design:type", organization_entity_1.Organization)
], OrganizationUser.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, (role) => role.organizationUsers),
    __metadata("design:type", role_entity_1.Role)
], OrganizationUser.prototype, "role", void 0);
exports.OrganizationUser = OrganizationUser = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['user', 'organization'])
], OrganizationUser);
//# sourceMappingURL=organizationUser.entity.js.map