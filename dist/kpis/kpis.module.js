"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpisModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const kpis_service_1 = require("./kpis.service");
const kpis_controller_1 = require("./kpis.controller");
const kpi_entity_1 = require("./entities/kpi.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sync_service_1 = require("../database/sync.service");
let KpisModule = class KpisModule {
};
exports.KpisModule = KpisModule;
exports.KpisModule = KpisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([kpi_entity_1.Kpi, venue_entity_1.Venue, user_entity_1.User]),
        ],
        controllers: [kpis_controller_1.KpisController],
        providers: [kpis_service_1.KpisService, sync_service_1.SyncService],
        exports: [kpis_service_1.KpisService],
    })
], KpisModule);
//# sourceMappingURL=kpis.module.js.map