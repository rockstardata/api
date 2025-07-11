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
const typeorm_1 = require("@nestjs/typeorm");
const income_service_1 = require("./income.service");
const income_controller_1 = require("./income.controller");
const income_entity_1 = require("./entities/income.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const sale_entity_1 = require("../sales/entities/sale.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sync_service_1 = require("../database/sync.service");
let IncomeModule = class IncomeModule {
};
exports.IncomeModule = IncomeModule;
exports.IncomeModule = IncomeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([income_entity_1.Income, venue_entity_1.Venue, sale_entity_1.Sale, user_entity_1.User]),
        ],
        controllers: [income_controller_1.IncomeController],
        providers: [income_service_1.IncomeService, sync_service_1.SyncService],
        exports: [income_service_1.IncomeService],
    })
], IncomeModule);
//# sourceMappingURL=income.module.js.map