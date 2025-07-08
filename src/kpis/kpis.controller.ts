import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KpisService } from './kpis.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';

@Controller('kpis')
export class KpisController {
  constructor(private readonly kpisService: KpisService) {}

  @Post()
  create(@Body() createKpiDto: CreateKpiDto) {
    return this.kpisService.create(createKpiDto);
  }

  @Get()
  findAll() {
    return this.kpisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kpisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKpiDto: UpdateKpiDto) {
    return this.kpisService.update(+id, updateKpiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kpisService.remove(+id);
  }
}
