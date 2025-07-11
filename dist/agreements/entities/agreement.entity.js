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
exports.Agreement = exports.AgreementType = exports.AgreementStatus = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const venue_entity_1 = require("../../venue/entities/venue.entity");
const typeorm_1 = require("typeorm");
var AgreementStatus;
(function (AgreementStatus) {
    AgreementStatus["DRAFT"] = "draft";
    AgreementStatus["ACTIVE"] = "active";
    AgreementStatus["EXPIRED"] = "expired";
    AgreementStatus["TERMINATED"] = "terminated";
})(AgreementStatus || (exports.AgreementStatus = AgreementStatus = {}));
var AgreementType;
(function (AgreementType) {
    AgreementType["VENUE_RENTAL"] = "venue_rental";
    AgreementType["SERVICE_PROVIDER"] = "service_provider";
    AgreementType["SUPPLIER"] = "supplier";
    AgreementType["PARTNERSHIP"] = "partnership";
    AgreementType["OTHER"] = "other";
})(AgreementType || (exports.AgreementType = AgreementType = {}));
let Agreement = class Agreement {
    id;
    title;
    description;
    type;
    status;
    startDate;
    endDate;
    amount;
    terms;
    contractNumber;
    isActive;
    createdAt;
    updatedAt;
    venue;
    createdBy;
    responsiblePerson;
};
exports.Agreement = Agreement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Agreement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Agreement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Agreement.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AgreementType,
        default: AgreementType.OTHER,
    }),
    __metadata("design:type", String)
], Agreement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AgreementStatus,
        default: AgreementStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Agreement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Agreement.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Agreement.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Agreement.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Agreement.prototype, "terms", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Agreement.prototype, "contractNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Agreement.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Agreement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Agreement.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue, (venue) => venue.agreements),
    __metadata("design:type", venue_entity_1.Venue)
], Agreement.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Agreement.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Agreement.prototype, "responsiblePerson", void 0);
exports.Agreement = Agreement = __decorate([
    (0, typeorm_1.Entity)()
], Agreement);
//# sourceMappingURL=agreement.entity.js.map