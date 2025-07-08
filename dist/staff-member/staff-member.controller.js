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
exports.StaffMemberController = void 0;
const common_1 = require("@nestjs/common");
const staff_member_service_1 = require("./staff-member.service");
const create_staff_member_dto_1 = require("./dto/create-staff-member.dto");
const update_staff_member_dto_1 = require("./dto/update-staff-member.dto");
let StaffMemberController = class StaffMemberController {
    staffMemberService;
    constructor(staffMemberService) {
        this.staffMemberService = staffMemberService;
    }
    create(createStaffMemberDto) {
        return this.staffMemberService.create(createStaffMemberDto);
    }
    findAll() {
        return this.staffMemberService.findAll();
    }
    findOne(id) {
        return this.staffMemberService.findOne(+id);
    }
    update(id, updateStaffMemberDto) {
        return this.staffMemberService.update(+id, updateStaffMemberDto);
    }
    remove(id) {
        return this.staffMemberService.remove(+id);
    }
};
exports.StaffMemberController = StaffMemberController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_member_dto_1.CreateStaffMemberDto]),
    __metadata("design:returntype", void 0)
], StaffMemberController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaffMemberController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffMemberController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_member_dto_1.UpdateStaffMemberDto]),
    __metadata("design:returntype", void 0)
], StaffMemberController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaffMemberController.prototype, "remove", null);
exports.StaffMemberController = StaffMemberController = __decorate([
    (0, common_1.Controller)('staff-member'),
    __metadata("design:paramtypes", [staff_member_service_1.StaffMemberService])
], StaffMemberController);
//# sourceMappingURL=staff-member.controller.js.map