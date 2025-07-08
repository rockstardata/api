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
exports.Venue = void 0;
const business_entity_1 = require("../../business/entities/business.entity");
const user_venue_role_entity_1 = require("../../users/entities/user-venue-role.entity");
const ticket_entity_1 = require("../../tickets/entities/ticket.entity");
const typeorm_1 = require("typeorm");
let Venue = class Venue {
    id;
    name;
    business;
    userVenueRoles;
    tickets;
};
exports.Venue = Venue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Venue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Venue.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_entity_1.Business, (business) => business.venues),
    __metadata("design:type", business_entity_1.Business)
], Venue.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_venue_role_entity_1.UserVenueRole, (userVenueRole) => userVenueRole.venue),
    __metadata("design:type", Array)
], Venue.prototype, "userVenueRoles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.venue),
    __metadata("design:type", Array)
], Venue.prototype, "tickets", void 0);
exports.Venue = Venue = __decorate([
    (0, typeorm_1.Entity)()
], Venue);
//# sourceMappingURL=venue.entity.js.map