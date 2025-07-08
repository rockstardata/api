"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKpiDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_kpi_dto_1 = require("./create-kpi.dto");
class UpdateKpiDto extends (0, mapped_types_1.PartialType)(create_kpi_dto_1.CreateKpiDto) {
}
exports.UpdateKpiDto = UpdateKpiDto;
//# sourceMappingURL=update-kpi.dto.js.map