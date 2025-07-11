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
exports.Ticket = exports.TicketStatus = void 0;
const venue_entity_1 = require("../../venue/entities/venue.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const sale_entity_1 = require("../../sales/entities/sale.entity");
const typeorm_1 = require("typeorm");
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["PENDING"] = "pending";
    TicketStatus["PAID"] = "paid";
    TicketStatus["CANCELLED"] = "cancelled";
    TicketStatus["REFUNDED"] = "refunded";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
let Ticket = class Ticket {
    id;
    totalAmount;
    status;
    customerName;
    customerEmail;
    customerPhone;
    notes;
    createdAt;
    updatedAt;
    venue;
    createdBy;
    sales;
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Ticket.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.PENDING,
    }),
    __metadata("design:type", String)
], Ticket.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "customerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "customerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Ticket.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Ticket.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, (venue) => venue.tickets),
    __metadata("design:type", venue_entity_1.Venue)
], Ticket.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Ticket.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_entity_1.Sale, (sale) => sale.ticket, { cascade: true }),
    __metadata("design:type", Array)
], Ticket.prototype, "sales", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)()
], Ticket);
//# sourceMappingURL=ticket.entity.js.map