"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffMemberModule = void 0;
const common_1 = require("@nestjs/common");
const staff_member_service_1 = require("./staff-member.service");
const staff_member_controller_1 = require("./staff-member.controller");
let StaffMemberModule = class StaffMemberModule {
};
exports.StaffMemberModule = StaffMemberModule;
exports.StaffMemberModule = StaffMemberModule = __decorate([
    (0, common_1.Module)({
        controllers: [staff_member_controller_1.StaffMemberController],
        providers: [staff_member_service_1.StaffMemberService],
    })
], StaffMemberModule);
//# sourceMappingURL=staff-member.module.js.map