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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const organizationUser_entity_1 = require("../../organization/entities/organizationUser.entity");
const user_venue_role_entity_1 = require("./user-venue-role.entity");
const user_permission_entity_1 = require("../../auth/entities/user-permission.entity");
let User = class User {
    id;
    firstName;
    lastName;
    email;
    password;
    organizationUsers;
    userVenueRoles;
    permissions;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => organizationUser_entity_1.OrganizationUser, (organizationUser) => organizationUser.user),
    __metadata("design:type", Array)
], User.prototype, "organizationUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_venue_role_entity_1.UserVenueRole, (userVenueRole) => userVenueRole.user),
    __metadata("design:type", Array)
], User.prototype, "userVenueRoles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_permission_entity_1.UserPermission, (permission) => permission.user),
    __metadata("design:type", Array)
], User.prototype, "permissions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map