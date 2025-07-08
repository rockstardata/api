"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const organization_module_1 = require("./organization/organization.module");
const business_module_1 = require("./business/business.module");
const staff_member_module_1 = require("./staff-member/staff-member.module");
const venue_module_1 = require("./venue/venue.module");
const role_module_1 = require("./role/role.module");
const agreements_module_1 = require("./agreements/agreements.module");
const costs_module_1 = require("./costs/costs.module");
const income_module_1 = require("./income/income.module");
const kpis_module_1 = require("./kpis/kpis.module");
const tickets_module_1 = require("./tickets/tickets.module");
const sales_module_1 = require("./sales/sales.module");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            organization_module_1.OrganizationModule,
            business_module_1.BusinessModule,
            staff_member_module_1.StaffMemberModule,
            venue_module_1.VenueModule,
            role_module_1.RoleModule,
            agreements_module_1.AgreementsModule,
            costs_module_1.CostsModule,
            income_module_1.IncomeModule,
            kpis_module_1.KpisModule,
            tickets_module_1.TicketsModule,
            sales_module_1.SalesModule,
            auth_module_1.AuthModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map