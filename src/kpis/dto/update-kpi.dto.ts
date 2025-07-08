import { PartialType } from '@nestjs/mapped-types';
import { CreateKpiDto } from './create-kpi.dto';

export class UpdateKpiDto extends PartialType(CreateKpiDto) {}
