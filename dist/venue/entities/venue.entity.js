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
const company_entity_1 = require("../../company/entities/company.entity");
const user_venue_role_entity_1 = require("../../users/entities/user-venue-role.entity");
const ticket_entity_1 = require("../../tickets/entities/ticket.entity");
const sale_entity_1 = require("../../sales/entities/sale.entity");
const cost_entity_1 = require("../../costs/entities/cost.entity");
const income_entity_1 = require("../../income/entities/income.entity");
const kpi_entity_1 = require("../../kpis/entities/kpi.entity");
const agreement_entity_1 = require("../../agreements/entities/agreement.entity");
const staff_member_entity_1 = require("../../staff-member/entities/staff-member.entity");
const typeorm_1 = require("typeorm");
let Venue = class Venue {
    id;
    name;
    description;
    address;
    phone;
    email;
    isActive;
    createdAt;
    updatedAt;
    company;
    userVenueRoles;
    tickets;
    sales;
    costs;
    incomes;
    kpis;
    agreements;
    staffMembers;
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
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Venue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Venue.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Venue.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Venue.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Venue.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Venue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Venue.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, (company) => company.venues),
    __metadata("design:type", company_entity_1.Company)
], Venue.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_venue_role_entity_1.UserVenueRole, (userVenueRole) => userVenueRole.venue),
    __metadata("design:type", Array)
], Venue.prototype, "userVenueRoles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.venue),
    __metadata("design:type", Array)
], Venue.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_entity_1.Sale, (sale) => sale.venue),
    __metadata("design:type", Array)
], Venue.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cost_entity_1.Cost, (cost) => cost.venue),
    __metadata("design:type", Array)
], Venue.prototype, "costs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => income_entity_1.Income, (income) => income.venue),
    __metadata("design:type", Array)
], Venue.prototype, "incomes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kpi_entity_1.Kpi, (kpi) => kpi.venue),
    __metadata("design:type", Array)
], Venue.prototype, "kpis", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => agreement_entity_1.Agreement, (agreement) => agreement.venue),
    __metadata("design:type", Array)
], Venue.prototype, "agreements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => staff_member_entity_1.StaffMember, (staffMember) => staffMember.venue),
    __metadata("design:type", Array)
], Venue.prototype, "staffMembers", void 0);
exports.Venue = Venue = __decorate([
    (0, typeorm_1.Entity)()
], Venue);
//# sourceMappingURL=venue.entity.js.map