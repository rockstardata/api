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
exports.Cost = exports.CostFrequency = exports.CostCategory = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const venue_entity_1 = require("../../venue/entities/venue.entity");
const typeorm_1 = require("typeorm");
var CostCategory;
(function (CostCategory) {
    CostCategory["RENT"] = "rent";
    CostCategory["UTILITIES"] = "utilities";
    CostCategory["SALARY"] = "salary";
    CostCategory["SUPPLIES"] = "supplies";
    CostCategory["MAINTENANCE"] = "maintenance";
    CostCategory["MARKETING"] = "marketing";
    CostCategory["INSURANCE"] = "insurance";
    CostCategory["TAXES"] = "taxes";
    CostCategory["OTHER"] = "other";
})(CostCategory || (exports.CostCategory = CostCategory = {}));
var CostFrequency;
(function (CostFrequency) {
    CostFrequency["ONE_TIME"] = "one_time";
    CostFrequency["DAILY"] = "daily";
    CostFrequency["WEEKLY"] = "weekly";
    CostFrequency["MONTHLY"] = "monthly";
    CostFrequency["QUARTERLY"] = "quarterly";
    CostFrequency["YEARLY"] = "yearly";
})(CostFrequency || (exports.CostFrequency = CostFrequency = {}));
let Cost = class Cost {
    id;
    name;
    description;
    amount;
    category;
    frequency;
    date;
    dueDate;
    isPaid;
    invoiceNumber;
    vendor;
    isActive;
    createdAt;
    updatedAt;
    venue;
    createdBy;
    approvedBy;
};
exports.Cost = Cost;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cost.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cost.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cost.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Cost.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CostCategory,
        default: CostCategory.OTHER,
    }),
    __metadata("design:type", String)
], Cost.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CostFrequency,
        default: CostFrequency.ONE_TIME,
    }),
    __metadata("design:type", String)
], Cost.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Cost.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Cost.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Cost.prototype, "isPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cost.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cost.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Cost.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Cost.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Cost.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, (venue) => venue.costs),
    __metadata("design:type", venue_entity_1.Venue)
], Cost.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Cost.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Cost.prototype, "approvedBy", void 0);
exports.Cost = Cost = __decorate([
    (0, typeorm_1.Entity)()
], Cost);
//# sourceMappingURL=cost.entity.js.map