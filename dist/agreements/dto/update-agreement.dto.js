"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAgreementDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_agreement_dto_1 = require("./create-agreement.dto");
class UpdateAgreementDto extends (0, mapped_types_1.PartialType)(create_agreement_dto_1.CreateAgreementDto) {
}
exports.UpdateAgreementDto = UpdateAgreementDto;
//# sourceMappingURL=update-agreement.dto.js.map