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
exports.Kpi = exports.KpiPeriod = exports.KpiType = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const venue_entity_1 = require("../../venue/entities/venue.entity");
const typeorm_1 = require("typeorm");
var KpiType;
(function (KpiType) {
    KpiType["REVENUE"] = "revenue";
    KpiType["ATTENDANCE"] = "attendance";
    KpiType["CONVERSION_RATE"] = "conversion_rate";
    KpiType["CUSTOMER_SATISFACTION"] = "customer_satisfaction";
    KpiType["OPERATIONAL_EFFICIENCY"] = "operational_efficiency";
    KpiType["COST_PER_ATTENDEE"] = "cost_per_attendee";
    KpiType["PROFIT_MARGIN"] = "profit_margin";
    KpiType["OTHER"] = "other";
})(KpiType || (exports.KpiType = KpiType = {}));
var KpiPeriod;
(function (KpiPeriod) {
    KpiPeriod["DAILY"] = "daily";
    KpiPeriod["WEEKLY"] = "weekly";
    KpiPeriod["MONTHLY"] = "monthly";
    KpiPeriod["QUARTERLY"] = "quarterly";
    KpiPeriod["YEARLY"] = "yearly";
})(KpiPeriod || (exports.KpiPeriod = KpiPeriod = {}));
let Kpi = class Kpi {
    id;
    name;
    description;
    type;
    period;
    targetValue;
    actualValue;
    percentage;
    startDate;
    endDate;
    unit;
    isActive;
    createdAt;
    updatedAt;
    venue;
    createdBy;
    responsiblePerson;
};
exports.Kpi = Kpi;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Kpi.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Kpi.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Kpi.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: KpiType,
        default: KpiType.OTHER,
    }),
    __metadata("design:type", String)
], Kpi.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: KpiPeriod,
        default: KpiPeriod.MONTHLY,
    }),
    __metadata("design:type", String)
], Kpi.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Kpi.prototype, "targetValue", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Kpi.prototype, "actualValue", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Kpi.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Kpi.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Kpi.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Kpi.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Kpi.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Kpi.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Kpi.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, (venue) => venue.kpis),
    __metadata("design:type", venue_entity_1.Venue)
], Kpi.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Kpi.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Kpi.prototype, "responsiblePerson", void 0);
exports.Kpi = Kpi = __decorate([
    (0, typeorm_1.Entity)()
], Kpi);
//# sourceMappingURL=kpi.entity.js.map