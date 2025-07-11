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
const swagger_1 = require("@nestjs/swagger");
const staff_member_service_1 = require("./staff-member.service");
const create_staff_member_dto_1 = require("./dto/create-staff-member.dto");
const update_staff_member_dto_1 = require("./dto/update-staff-member.dto");
const staff_member_entity_1 = require("./entities/staff-member.entity");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../role/enums/role.enum");
let StaffMemberController = class StaffMemberController {
    staffMemberService;
    constructor(staffMemberService) {
        this.staffMemberService = staffMemberService;
    }
    async create(createStaffMemberDto, req) {
        return this.staffMemberService.create(createStaffMemberDto, req.user.id);
    }
    async findAll(venueId, role) {
        return this.staffMemberService.findAll(venueId ? +venueId : undefined, role);
    }
    async findByVenue(venueId) {
        return this.staffMemberService.findByVenue(+venueId);
    }
    async findByRole(role) {
        return this.staffMemberService.findByRole(role);
    }
    async findActiveStaff(venueId) {
        return this.staffMemberService.findActiveStaff(venueId ? +venueId : undefined);
    }
    async getStaffBySalaryRange(venueId, minSalary, maxSalary) {
        return this.staffMemberService.getStaffBySalaryRange(+venueId, +minSalary, +maxSalary);
    }
    async getTotalSalaryByVenue(venueId) {
        return this.staffMemberService.getTotalSalaryByVenue(+venueId);
    }
    async getStaffCountByRole(venueId) {
        return this.staffMemberService.getStaffCountByRole(+venueId);
    }
    async findOne(id) {
        return this.staffMemberService.findOne(+id);
    }
    async update(id, updateStaffMemberDto, req) {
        return this.staffMemberService.update(+id, updateStaffMemberDto, req.user.id);
    }
    async remove(id) {
        return this.staffMemberService.remove(+id);
    }
    async getStaffRoles() {
        return Object.values(staff_member_entity_1.StaffRole);
    }
};
exports.StaffMemberController = StaffMemberController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new staff member' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Staff member created successfully', type: staff_member_entity_1.StaffMember }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_staff_member_dto_1.CreateStaffMemberDto, Object]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all staff members' }),
    (0, swagger_1.ApiQuery)({ name: 'venueId', required: false, description: 'Filter by venue ID' }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false, description: 'Filter by staff role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff members retrieved successfully', type: [staff_member_entity_1.StaffMember] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('venueId')),
    __param(1, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('venue/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff members by venue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff members retrieved successfully', type: [staff_member_entity_1.StaffMember] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "findByVenue", null);
__decorate([
    (0, common_1.Get)('role/:role'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff members by role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff members retrieved successfully', type: [staff_member_entity_1.StaffMember] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active staff members' }),
    (0, swagger_1.ApiQuery)({ name: 'venueId', required: false, description: 'Filter by venue ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active staff members retrieved successfully', type: [staff_member_entity_1.StaffMember] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "findActiveStaff", null);
__decorate([
    (0, common_1.Get)('salary-range/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff members by salary range' }),
    (0, swagger_1.ApiQuery)({ name: 'minSalary', required: true, description: 'Minimum salary' }),
    (0, swagger_1.ApiQuery)({ name: 'maxSalary', required: true, description: 'Maximum salary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff members retrieved successfully', type: [staff_member_entity_1.StaffMember] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __param(1, (0, common_1.Query)('minSalary')),
    __param(2, (0, common_1.Query)('maxSalary')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "getStaffBySalaryRange", null);
__decorate([
    (0, common_1.Get)('total-salary/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total salary by venue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Total salary calculated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "getTotalSalaryByVenue", null);
__decorate([
    (0, common_1.Get)('count-by-role/:venueId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff count by role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff count by role retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "getStaffCountByRole", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff member by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff member retrieved successfully', type: staff_member_entity_1.StaffMember }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin, role_enum_1.Role.CEO),
    (0, swagger_1.ApiOperation)({ summary: 'Update staff member' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff member updated successfully', type: staff_member_entity_1.StaffMember }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_staff_member_dto_1.UpdateStaffMemberDto, Object]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete staff member' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Staff member deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Staff member not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('roles/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all staff roles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff roles retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StaffMemberController.prototype, "getStaffRoles", null);
exports.StaffMemberController = StaffMemberController = __decorate([
    (0, swagger_1.ApiTags)('staff-members'),
    (0, common_1.Controller)('staff-members'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [staff_member_service_1.StaffMemberService])
], StaffMemberController);
//# sourceMappingURL=staff-member.controller.js.map