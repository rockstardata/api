"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCostDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cost_dto_1 = require("./create-cost.dto");
class UpdateCostDto extends (0, mapped_types_1.PartialType)(create_cost_dto_1.CreateCostDto) {
}
exports.UpdateCostDto = UpdateCostDto;
//# sourceMappingURL=update-cost.dto.js.map