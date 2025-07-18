import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { RecService } from './rec.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('rec')
@Controller('rec')
export class RecController {
  constructor(private readonly recService: RecService) {}

  // Endpoint genérico para hacer queries a la base de datos externa
  @Get('query')
  @ApiOperation({
    summary: 'Execute custom SQL query',
    description: 'Execute a custom SQL query against the external database',
  })
  @ApiQuery({
    name: 'sql',
    required: true,
    description: 'SQL query to execute',
  })
  @ApiResponse({
    status: 200,
    description: 'Query executed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - SQL parameter is required',
  })
  async queryExternalDb(@Query('sql') sql: string) {
    if (!sql) {
      throw new BadRequestException('El parámetro sql es requerido');
    }
    return this.recService.queryExternalDb(sql);
  }

  // Endpoint para KPI: Beneficio estimado
  @Get('kpi/beneficio-estimado')
  @ApiOperation({
    summary: 'Get Estimated Profit KPI',
    description: 'Get the Estimated Profit (KPI 4) for a company, year and week',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Company name (e.g., PALLAPIZZA)',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description: 'Year (e.g., 2024)',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Week number (e.g., 11)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estimated Profit KPI result',
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required parameters',
  })
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
  @ApiOperation({
    summary: 'Test external database connection',
    description: 'Test the connection to the external database',
  })
  @ApiResponse({
    status: 200,
    description: 'Connection test completed successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Connection test failed',
  })
  async testExternalConnection() {
    return this.recService.testExternalConnection();
  }
} 