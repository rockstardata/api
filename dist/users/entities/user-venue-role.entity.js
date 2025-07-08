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
exports.UserVenueRole = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const venue_entity_1 = require("../../venue/entities/venue.entity");
const role_entity_1 = require("../../role/entities/role.entity");
let UserVenueRole = class UserVenueRole {
    id;
    user;
    venue;
    role;
};
exports.UserVenueRole = UserVenueRole;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserVenueRole.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.userVenueRoles),
    __metadata("design:type", user_entity_1.User)
], UserVenueRole.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, (venue) => venue.userVenueRoles),
    __metadata("design:type", venue_entity_1.Venue)
], UserVenueRole.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, (role) => role.userVenueRoles),
    __metadata("design:type", role_entity_1.Role)
], UserVenueRole.prototype, "role", void 0);
exports.UserVenueRole = UserVenueRole = __decorate([
    (0, typeorm_1.Entity)()
], UserVenueRole);
//# sourceMappingURL=user-venue-role.entity.js.map