"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIncomeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_income_dto_1 = require("./create-income.dto");
class UpdateIncomeDto extends (0, mapped_types_1.PartialType)(create_income_dto_1.CreateIncomeDto) {
}
exports.UpdateIncomeDto = UpdateIncomeDto;
//# sourceMappingURL=update-income.dto.js.map