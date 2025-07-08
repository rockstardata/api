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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementsController = void 0;
const common_1 = require("@nestjs/common");
const agreements_service_1 = require("./agreements.service");
const create_agreement_dto_1 = require("./dto/create-agreement.dto");
const update_agreement_dto_1 = require("./dto/update-agreement.dto");
let AgreementsController = class AgreementsController {
    agreementsService;
    constructor(agreementsService) {
        this.agreementsService = agreementsService;
    }
    create(createAgreementDto) {
        return this.agreementsService.create(createAgreementDto);
    }
    findAll() {
        return this.agreementsService.findAll();
    }
    findOne(id) {
        return this.agreementsService.findOne(+id);
    }
    update(id, updateAgreementDto) {
        return this.agreementsService.update(+id, updateAgreementDto);
    }
    remove(id) {
        return this.agreementsService.remove(+id);
    }
};
exports.AgreementsController = AgreementsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agreement_dto_1.CreateAgreementDto]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agreement_dto_1.UpdateAgreementDto]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "remove", null);
exports.AgreementsController = AgreementsController = __decorate([
    (0, common_1.Controller)('agreements'),
    __metadata("design:paramtypes", [agreements_service_1.AgreementsService])
], AgreementsController);
//# sourceMappingURL=agreements.controller.js.map