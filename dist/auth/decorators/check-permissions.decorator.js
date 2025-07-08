"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPermissions = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
const CheckPermissions = (permission, resource, resourceIdParam = 'id') => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, { permission, resource, resourceIdParam });
exports.CheckPermissions = CheckPermissions;
//# sourceMappingURL=check-permissions.decorator.js.map