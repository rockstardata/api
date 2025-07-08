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
exports.Business = void 0;
const organization_entity_1 = require("../../organization/entities/organization.entity");
const staff_member_entity_1 = require("../../staff-member/entities/staff-member.entity");
const venue_entity_1 = require("../../venue/entities/venue.entity");
const typeorm_1 = require("typeorm");
let Business = class Business {
    id;
    name;
    organization;
    staffMembers;
    venues;
};
exports.Business = Business;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Business.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Business.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization, (org) => org.businesses),
    __metadata("design:type", organization_entity_1.Organization)
], Business.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_member_entity_1.StaffMember, (staff) => staff.business),
    __metadata("design:type", Array)
], Business.prototype, "staffMembers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => venue_entity_1.Venue, (venue) => venue.business),
    __metadata("design:type", Array)
], Business.prototype, "venues", void 0);
exports.Business = Business = __decorate([
    (0, typeorm_1.Entity)()
], Business);
//# sourceMappingURL=business.entity.js.map