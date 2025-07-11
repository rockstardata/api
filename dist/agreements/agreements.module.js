"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const agreements_service_1 = require("./agreements.service");
const agreements_controller_1 = require("./agreements.controller");
const agreement_entity_1 = require("./entities/agreement.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sync_service_1 = require("../database/sync.service");
let AgreementsModule = class AgreementsModule {
};
exports.AgreementsModule = AgreementsModule;
exports.AgreementsModule = AgreementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([agreement_entity_1.Agreement, venue_entity_1.Venue, user_entity_1.User]),
        ],
        controllers: [agreements_controller_1.AgreementsController],
        providers: [agreements_service_1.AgreementsService, sync_service_1.SyncService],
        exports: [agreements_service_1.AgreementsService],
    })
], AgreementsModule);
//# sourceMappingURL=agreements.module.js.map