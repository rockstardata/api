import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { RecService } from './rec.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('rec')
@Controller('rec')
export class RecController {
  constructor(private readonly recService: RecService) {}

  // Endpoint genérico para hacer queries a la base de datos externa
  @Get('query')
  async queryExternalDb(@Query('sql') sql: string) {
    if (!sql) {
      throw new BadRequestException('El parámetro sql es requerido');
    }
    return this.recService.queryExternalDb(sql);
  }

  // Endpoint para KPI: Beneficio estimado
  @Get('kpi/beneficio-estimado')
  @ApiOperation({ summary: 'Obtener el Beneficio Estimado (KPI 4) para una compañía, año y semana' })
  @ApiQuery({ name: 'company_name', required: true, description: 'Nombre de la compañía (ej: PALLAPIZZA)' })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({ name: 'week_number', required: true, description: 'Número de semana (ej: 11)' })
  @ApiResponse({ status: 200, description: 'Resultado del KPI Beneficio Estimado' })
  @ApiResponse({ status: 400, description: 'Faltan parámetros requeridos' })
  async getBeneficioEstimado(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      throw new BadRequestException('Faltan parámetros requeridos: company_name, year, week_number');
    }
    return this.recService.getBeneficioEstimado(companyName, Number(year), Number(weekNumber));
  }

  @Get('test-external-connection')
  async testExternalConnection() {
    return this.recService.testExternalConnection();
  }
} 