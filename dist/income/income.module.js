"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeModule = void 0;
const common_1 = require("@nestjs/common");
const income_service_1 = require("./income.service");
const income_controller_1 = require("./income.controller");
const auth_module_1 = require("../auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_permission_entity_1 = require("../auth/entities/user-permission.entity");
let IncomeModule = class IncomeModule {
};
exports.IncomeModule = IncomeModule;
exports.IncomeModule = IncomeModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, typeorm_1.TypeOrmModule.forFeature([user_permission_entity_1.UserPermission])],
        controllers: [income_controller_1.IncomeController],
        providers: [income_service_1.IncomeService],
    })
], IncomeModule);
//# sourceMappingURL=income.module.js.map