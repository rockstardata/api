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
exports.Income = exports.IncomeStatus = exports.IncomeCategory = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const venue_entity_1 = require("../../venue/entities/venue.entity");
const sale_entity_1 = require("../../sales/entities/sale.entity");
const typeorm_1 = require("typeorm");
var IncomeCategory;
(function (IncomeCategory) {
    IncomeCategory["TICKET_SALES"] = "ticket_sales";
    IncomeCategory["FOOD_BEVERAGE"] = "food_beverage";
    IncomeCategory["MERCHANDISE"] = "merchandise";
    IncomeCategory["SPONSORSHIP"] = "sponsorship";
    IncomeCategory["ADVERTISING"] = "advertising";
    IncomeCategory["RENTAL"] = "rental";
    IncomeCategory["SERVICES"] = "services";
    IncomeCategory["OTHER"] = "other";
})(IncomeCategory || (exports.IncomeCategory = IncomeCategory = {}));
var IncomeStatus;
(function (IncomeStatus) {
    IncomeStatus["PENDING"] = "pending";
    IncomeStatus["RECEIVED"] = "received";
    IncomeStatus["OVERDUE"] = "overdue";
    IncomeStatus["CANCELLED"] = "cancelled";
})(IncomeStatus || (exports.IncomeStatus = IncomeStatus = {}));
let Income = class Income {
    id;
    name;
    description;
    amount;
    category;
    status;
    date;
    dueDate;
    invoiceNumber;
    customer;
    paymentMethod;
    isActive;
    createdAt;
    updatedAt;
    venue;
    sale;
    createdBy;
    receivedBy;
};
exports.Income = Income;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Income.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Income.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Income.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Income.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IncomeCategory,
        default: IncomeCategory.OTHER,
    }),
    __metadata("design:type", String)
], Income.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IncomeStatus,
        default: IncomeStatus.PENDING,
    }),
    __metadata("design:type", String)
], Income.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Income.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Income.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Income.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Income.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Income.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Income.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Income.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Income.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, (venue) => venue.incomes),
    __metadata("design:type", venue_entity_1.Venue)
], Income.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sale_entity_1.Sale, { nullable: true }),
    __metadata("design:type", sale_entity_1.Sale)
], Income.prototype, "sale", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Income.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Income.prototype, "receivedBy", void 0);
exports.Income = Income = __decorate([
    (0, typeorm_1.Entity)()
], Income);
//# sourceMappingURL=income.entity.js.map