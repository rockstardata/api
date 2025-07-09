"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const users_module_1 = require("../users/users.module");
const permissions_controller_1 = require("./permissions.controller");
const permissions_service_1 = require("./permissions.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_permission_entity_1 = require("./entities/user-permission.entity");
const organization_entity_1 = require("../organization/entities/organization.entity");
const venue_entity_1 = require("../venue/entities/venue.entity");
const business_entity_1 = require("../business/entities/business.entity");
const user_entity_1 = require("../users/entities/user.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_permission_entity_1.UserPermission, user_entity_1.User, organization_entity_1.Organization, venue_entity_1.Venue, business_entity_1.Business]),
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController, permissions_controller_1.PermissionsController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, permissions_service_1.PermissionsService],
        exports: [jwt_strategy_1.JwtStrategy, passport_1.PassportModule, jwt_1.JwtModule, permissions_service_1.PermissionsService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map