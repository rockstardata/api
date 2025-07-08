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
exports.CostsController = void 0;
const common_1 = require("@nestjs/common");
const costs_service_1 = require("./costs.service");
const create_cost_dto_1 = require("./dto/create-cost.dto");
const update_cost_dto_1 = require("./dto/update-cost.dto");
let CostsController = class CostsController {
    costsService;
    constructor(costsService) {
        this.costsService = costsService;
    }
    create(createCostDto) {
        return this.costsService.create(createCostDto);
    }
    findAll() {
        return this.costsService.findAll();
    }
    findOne(id) {
        return this.costsService.findOne(+id);
    }
    update(id, updateCostDto) {
        return this.costsService.update(+id, updateCostDto);
    }
    remove(id) {
        return this.costsService.remove(+id);
    }
};
exports.CostsController = CostsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cost_dto_1.CreateCostDto]),
    __metadata("design:returntype", void 0)
], CostsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CostsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CostsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cost_dto_1.UpdateCostDto]),
    __metadata("design:returntype", void 0)
], CostsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CostsController.prototype, "remove", null);
exports.CostsController = CostsController = __decorate([
    (0, common_1.Controller)('costs'),
    __metadata("design:paramtypes", [costs_service_1.CostsService])
], CostsController);
//# sourceMappingURL=costs.controller.js.map