"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStaffMemberDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_staff_member_dto_1 = require("./create-staff-member.dto");
class UpdateStaffMemberDto extends (0, mapped_types_1.PartialType)(create_staff_member_dto_1.CreateStaffMemberDto) {
}
exports.UpdateStaffMemberDto = UpdateStaffMemberDto;
//# sourceMappingURL=update-staff-member.dto.js.map