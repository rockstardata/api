import { Controller, Get, Logger, Optional, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { exec } from 'child_process';
import { DataSource } from 'typeorm';
import { UsersService } from '../users/users.service';
import { VenueService } from '../venue/venue.service';
import { SyncService } from './sync.service';

@Controller('database')
@ApiTags('database')
export class DatabaseController {
  private readonly logger = new Logger(DatabaseController.name);

  constructor(
    private readonly syncService: SyncService,
    private readonly usersService: UsersService,
    private readonly venueService: VenueService,
    @Optional()
    @InjectDataSource('external')
    private readonly externalDataSource?: DataSource,
  ) { }

  @Post('sync-all')
  async syncAll() {
    return new Promise((resolve) => {
      exec(
        'node scripts/sync-all.js',
        { cwd: process.cwd() },
        (error, stdout, stderr) => {
          if (error) {
            this.logger.error('Error ejecutando sync-all.js', error);
            resolve({
              success: false,
              message: 'Error ejecutando la sincronización',
              error: error.message,
              stderr,
              stdout,
            });
          } else {
            resolve({
              success: true,
              message: 'Sincronización ejecutada correctamente',
              stdout,
              stderr,
            });
          }
        },
      );
    });
  }

  @Post('test-external-connection')
  async testExternalConnection() {
    return new Promise((resolve) => {
      exec(
        'node scripts/test-external-db.js',
        { cwd: process.cwd() },
        (error, stdout, stderr) => {
          if (error) {
            this.logger.error('Error ejecutando test-external-db.js', error);
            resolve({
              success: false,
              message: 'Error ejecutando la prueba de conexión externa',
              error: error.message,
              stderr,
              stdout,
            });
          } else {
            resolve({
              success: true,
              message: 'Prueba de conexión externa ejecutada correctamente',
              stdout,
              stderr,
            });
          }
        },
      );
    });
  }

  @Post('create-superadmin')
  @ApiOperation({
    summary: 'Crear Super Admin',
    description: `
    Crea un usuario Super Admin con todos los permisos del sistema.
    
    **Credenciales que se crearán:**
    - **Email:** pallapizza.superadmin@rockstardata.ia
    - **Password:** Admin.2025
    - **Nombre:** PALLAPIZZA SUPERADMIN
    
    **Permisos asignados automáticamente:**
    - view_income, view_sales, create_sales, update_sales, delete_sales
    - view_business, create_business, update_business, delete_business
    
    **Después de crear el Super Admin, puedes hacer login con:**
    \`\`\`bash
    curl -X POST /auth/login \\
      -H "Content-Type: application/json" \\
      -d '{
        "email": "pallapizza.superadmin@rockstardata.ia",
        "password": "Admin.2025"
      }'
    \`\`\`
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'Super Admin creado exitosamente con todos los permisos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'SuperAdmin creado con todos los permisos',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: {
              type: 'string',
              example: 'pallapizza.superadmin@rockstardata.ia',
            },
            firstName: { type: 'string', example: 'PALLAPIZZA' },
            lastName: { type: 'string', example: 'SUPERADMIN' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error al crear Super Admin',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Error al crear SuperAdmin' },
        error: { type: 'string', example: 'User already exists' },
      },
    },
  })
  async createSuperAdminUser() {
    const dto = {
      firstName: 'PALLAPIZZA',
      lastName: 'SUPERADMIN',
      email: 'pallapizza.superadmin@rockstardata.ia',
      password: 'Admin.2025',
    };
    try {
      const user = await this.usersService.createSuperAdmin(dto, 1);
      return {
        success: true,
        message: 'SuperAdmin creado con todos los permisos',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear SuperAdmin',
        error: error.message,
      };
    }
  }

  /**
   * GET /database/kpi/beneficio-estimado
   * KPI: Beneficio Estimado
   * VISTA EXPRES
   */
  @Get('kpi/beneficio-estimado')
  @ApiOperation({
    summary: 'KPI: Beneficio Estimado VISTA EXPRES',
    description:
      'Ejecuta: SELECT * from dwh.fn_estimated_profit_by_company_and_period($1, $2, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  async getBeneficioEstimado(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_estimated_profit_by_company_and_period($1, $2, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/kpi/ingresos-totales
   * KPI: Ingresos Totales
   * VISTA EXPRES
   */
  @Get('kpi/ingresos-totales')
  @ApiOperation({
    summary: 'KPI: Ingresos Totales VISTA EXPRES',
    description:
      'Ejecuta: SELECT * from dwh.fn_total_income_by_period($1, $2, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  async getIngresosTotales(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, week_number',
      };
    }
    const sql = 'SELECT * from dwh.fn_total_income_by_period($1, $2, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/kpi/gastos-totales
   * KPI: Gastos Totales
   * VISTA GENERAL
   */
  @Get('kpi/gastos-totales')
  @ApiOperation({
    summary: 'KPI: Gastos Totales VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, null, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'month_number',
    required: true,
    description: 'Número de mes (ej: 6 para junio)',
    example: '6',
  })
  async getGastosTotales(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, null, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      monthNumber,
    ]);
  }

  /**
   * GET /database/kpi/beneficio-estimado-por-local
   * KPI: Beneficio Estimado por Local
   * RESULTADO SEMANAL
   */
  @Get('kpi/beneficio-estimado-por-local')
  @ApiOperation({
    summary: 'KPI: Beneficio Estimado por Local RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_estimated_profit_by_venues_and_week($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  async getBeneficioEstimadoPorLocal(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_estimated_profit_by_venues_and_week($1, $2, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }
  /**
   * GET /database/kpi/beneficio-estimado-por-local
   * KPI: Beneficio Estimado General
   * RESULTADO SEMANAL
   */
  @Get('kpi/beneficio-estimado-por-local')
  @ApiOperation({
    summary: 'KPI: Beneficio Estimado General RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_estimated_profit_by_company_and_period($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  async getBeneficioEstimadoGeneral(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_estimated_profit_by_company_and_period($1, $2, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/kpi/gastos-totales-por-categoria
   * KPI: Gastos Totales por Categoría
   * VISTA GENERAL
   */
  @Get('kpi/gastos-totales-por-categoria')
  @ApiOperation({
    summary: 'KPI: Gastos Totales por Categoría VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, null, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'month_number',
    required: true,
    description: 'Número de mes (ej: 6 para junio)',
    example: '6',
  })
  async getGastosTotalesPorCategoria(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, null, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      monthNumber,
    ]);
  }

  /**
   * GET /database/kpi/ingresos-por-turno
   * KPI: Ingresos por Turno (todos los restaurantes, semanal)
   * VISTA EXPRES
   */
  @Get('kpi/ingresos-por-turno')
  @ApiOperation({
    summary: 'KPI: Ingresos por Turno VISTA EXPRES',
    description:
      'Ejecuta: SELECT * from dwh.fn_sales_comparison_by_section($1, $2, null, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  async getIngresosPorTurno(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_sales_comparison_by_section($1, $2, null, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/kpi/ratio-personal
   * KPI: Ratio Personal (un restaurante, semanal)
   * RESULTADO SEMANAL
   */
  @Get('kpi/ratio-personal')
  @ApiOperation({
    summary: 'KPI: Ratio Personal (un restaurante) RESULTADO SEMANAL',
    description:
      'Ratio de Personal (un restaurante) que es lo que retorna y la query que consume: SELECT * from dwh.fn_personnel_expense_ratio($1, $2, $3, $4, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'venue_name',
    required: false, // antes: true
    description: 'Nombre del restaurante/venue (opcional)',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  async getRatioPersonal(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('venue_name') venueName: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      // quitamos venueName de la validación obligatoria
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_personnel_expense_ratio2($1, $2, $3, $4, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      venueName || null, // si no se envía, pasa null
      weekNumber,
    ]);
  }

  /**
   * GET /database/kpi/ratio-personal-general
   * KPI: Ratio Personal General (todos los restaurantes, semanal)
   * RESULTADO SEMANAL
   */
  @Get('kpi/ratio-personal-general')
  @ApiOperation({
    summary: 'KPI: Ratio Personal General RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_personnel_expense_ratio($1, $2, null, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  async getRatioPersonalGeneral(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_personnel_expense_ratio2($1, $2, null, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/kpi/comensales-totales
   * KPI: Comensales Totales
   * VISTA EXPRES
   */
  @Get('kpi/numero-comensales-por-restaurante')
  @ApiOperation({
    summary: 'KPI: Número de Comensales por Restaurante VISTA EXPRES',
    description:
      'Ejecuta: SELECT * from dwh.fn_weekly_attendance_by_venue($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  async getNumeroComensales(
    @Query('company_name') companyName: string,
    @Query('week_number') weekNumber: string,
    @Query('year') year: string,
  ) {
    if (!companyName || !weekNumber || !year) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, week_number, year',
      };
    }
    const sql = 'SELECT * from dwh.fn_weekly_attendance_by_venue($1, $2, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      weekNumber,
      year,
    ]);
  }
  /**
   * GET /database/kpi/comensales-totales
   * KPI: Comensales Totales
   * VISTA EXPRES
   */
  @Get('kpi/comensales-totales')
  @ApiOperation({
    summary: 'KPI: Comensales Totales VISTA EXPRES',
    description:
      'Ejecuta: SELECT * from dwh.fn_week_total_attendees($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  async getComensalesTotales(
    @Query('company_name') companyName: string,
    @Query('week_number') weekNumber: string,
    @Query('year') year: string,
  ) {
    if (!companyName || !weekNumber || !year) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, week_number, year',
      };
    }
    const sql = 'SELECT * from dwh.fn_week_total_attendees($1, $2, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      weekNumber,
      year,
    ]);
  }
  /**
   * GET /database/kpi/ingresos-por-restaurante-diario
   * KPI: Ingresos por Restaurante (diario)
   * VISTA EXPRES
   */
  @Get('kpi/ingresos-por-restaurante-diario')
  @ApiOperation({
    summary: 'KPI: Ingresos por Restaurante (diario) VISTA EXPRES',
    description:
      'Ejecuta: SELECT * FROM dwh.fn_weekly_venues_income($1, $2, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  async getIngresosPorRestauranteDiario(
    @Query('company_name') companyName: string,
    @Query('week_number') weekNumber: string,
    @Query('year') year: string,
  ) {
    if (!companyName || !weekNumber || !year) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, week_number, year',
      };
    }
    const sql = 'SELECT * FROM dwh.fn_weekly_venues_income($1, $2, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      weekNumber,
      year,
    ]);
  }

  /**
   * GET /database/kpi/comensales-por-restaurante-diario
   * KPI: Comensales por Restaurante (diario)
   * VISTA EXPRES
   */
  @Get('kpi/comensales-por-restaurante-diario')
  @ApiOperation({
    summary: 'KPI: Comensales por Restaurante (diario) VISTA EXPRES',
    description:
      'Ejecuta: SELECT * FROM dwh.fn_weekly_attendance_by_venue($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  async getComensalesPorRestauranteDiario(
    @Query('company_name') companyName: string,
    @Query('week_number') weekNumber: string,
    @Query('year') year: string,
  ) {
    if (!companyName || !weekNumber || !year) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, week_number, year',
      };
    }
    const sql = 'SELECT * FROM dwh.fn_weekly_attendance_by_venue($1, $2, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      weekNumber,
      year,
    ]);
  }

  /**
   * GET /database/kpi/ticket-medio-por-comensal
   * KPI: Ticket Medio por Comensal
   * VISTA EXPRES
   */
  @Get('kpi/ticket-medio-por-comensal')
  @ApiOperation({
    summary: 'KPI: Ticket Medio por Comensal VISTA EXPRES',
    description:
      'Ejecuta: SELECT * FROM dwh.fn_weekly_avg_income_per_attendee($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  async getTicketMedioPorComensal(
    @Query('company_name') companyName: string,
    @Query('week_number') weekNumber: string,
    @Query('year') year: string,
  ) {
    if (!companyName || !weekNumber || !year) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, week_number, year',
      };
    }
    const sql =
      'SELECT * FROM dwh.fn_weekly_avg_income_per_attendee($1, $2, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      weekNumber,
      year,
    ]);
  }

  /**
   * GET /database/kpi/ticket-medio-por-comensal-restaurante-diario
   * KPI: Ticket Medio por Comensal y Restaurante (diario)
   * VISTA EXPRES
   */
  @Get('kpi/ticket-medio-por-comensal-restaurante-diario')
  @ApiOperation({
    summary:
      'KPI: Ticket Medio por Comensal y Restaurante (diario) VISTA EXPRES',
    description:
      'Ejecuta: SELECT * FROM dwh.fn_weekly_avg_ticket_by_venue($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  async getTicketMedioPorComensalRestauranteDiario(
    @Query('company_name') companyName: string,
    @Query('week_number') weekNumber: string,
    @Query('year') year: string,
  ) {
    if (!companyName || !weekNumber || !year) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, week_number, year',
      };
    }
    const sql = 'SELECT * FROM dwh.fn_weekly_avg_ticket_by_venue($1, $2, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      weekNumber,
      year,
    ]);
  }

  /**
   * GET /database/kpi/ingresos-totales-por-restaurante
   * KPI: Ingresos Totales por Restaurante (mensual)
   * VISTA GENERAL
   */
  @Get('kpi/ingresos-totales-por-restaurante')
  @ApiOperation({
    summary: 'KPI: Ingresos Totales por Restaurante  VISTA GENERAL',
    description:
      'Ejecuta: SELECT * FROM dwh.get_venue_income_by_period($1, $2, $3, null, $4)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({
    name: 'venue_name',
    required: true,
    description: 'Nombre del restaurante',
    example: 'PALLAPIZZA CENTRO',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'month_number',
    required: true,
    description: 'Número de mes (ej: 6 para junio)',
    example: '6',
  })
  async getIngresosTotalesPorRestaurante(
    @Query('company_name') companyName: string,
    @Query('venue_name') venueName: string,
    @Query('year') year: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !venueName || !year || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, venue_name, year, month_number',
      };
    }
    const sql =
      'SELECT * FROM dwh.get_venue_income_by_period($1, $2, $3, null, $4)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      venueName,
      year,
      monthNumber,
    ]);
  }

  /**
   * GET /database/kpi/gastos-totales-por-restaurante
   * KPI: Gastos Totales por Restaurante (mensual)
   * VISTA GENERAL
   */
  @Get('kpi/gastos-totales-por-restaurante')
  @ApiOperation({
    summary: 'Gastos Totales (un restaurante) VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.get_debit_variation_by_venue_and_period($1, $2, $3, null, $4)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({
    name: 'venue_name',
    required: true,
    description: 'Nombre del restaurante/venue',
    example: 'PALLAPIZZA CENTRO',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'month_number',
    required: true,
    description: 'Número de mes (ej: 6 para junio)',
    example: '6',
  })
  async getGastosTotalesPorRestaurante(
    @Query('company_name') companyName: string,
    @Query('venue_name') venueName: string,
    @Query('year') year: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !venueName || !year || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, venue_name, year, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.get_debit_variation_by_venue_and_period($1, $2, $3, null, $4)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      venueName,
      year,
      monthNumber,
    ]);
  }

  /**
   * GET /database/kpi/beneficio-estimado-por-restaurante
   * KPI: Beneficio Estimado (un restaurante, semanal)
   * RESULTADO SEMANAL
   */
  @Get('kpi/beneficio-estimado-por-restaurante')
  @ApiOperation({
    summary: 'Beneficio Estimado (un restaurante) RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_estimated_profit_by_venue_and_period($1, $2, $3, $4, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({
    name: 'venue_name',
    required: true,
    description: 'Nombre del restaurante/venue',
    example: 'PALLAPIZZA CENTRO',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
    example: '11',
  })
  async getBeneficioEstimadoPorRestaurante(
    @Query('company_name') companyName: string,
    @Query('venue_name') venueName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !venueName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, venue_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from  dwh.fn_estimated_profit_by_venue_and_period($1, $2, $3, $4, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      venueName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/kpi/ingresos-por-categoria
   * KPI: Ingresos por Categoría (todos los restaurantes, mensual)
   * VISTA GENERAL
   */
  @Get('kpi/ingresos-por-categoria')
  @ApiOperation({
    summary: 'Ingresos por categoría (todos los restaurantes) VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_sales_comparison_by_section($1, $2, null, null, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'month_number',
    required: true,
    description: 'Número de mes (ej: 6 para junio)',
    example: '6',
  })
  async getIngresosPorCategoria(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_sales_comparison_by_section($1, $2, null, null, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      monthNumber,
    ]);
  }

  /**
   * GET /database/kpi/ingresos-por-categoria-restaurante
   * KPI: Ingresos por Categoría (un restaurante, mensual)
   * VISTA GENERAL
   */
  @Get('kpi/ingresos-por-categoria-restaurante')
  @ApiOperation({
    summary: 'Ingresos por categoría (un restaurante) VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_sales_comparison_by_section($1, $2, $3, null, $4)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'venue_name',
    required: true,
    description: 'Nombre del restaurante/venue',
    example: 'PALLAPIZZA CENTRO',
  })
  @ApiQuery({
    name: 'month_number',
    required: true,
    description: 'Número de mes (ej: 6 para junio)',
    example: '6',
  })
  async getIngresosPorCategoriaRestaurante(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('venue_name') venueName: string,
    @Query('month_number') monthNumber: string,
  ) {
    try {
      if (!companyName || !year || !venueName || !monthNumber) {
        return {
          success: false,
          message:
            'Faltan parámetros requeridos: company_name, venue_name, year, month_number',
        };
      }
      const sql =
        'SELECT * from dwh.fn_sales_comparison_by_section($1, $2, $3, null, $4)';
      console.log(sql);
      return await this.syncService.queryExternalKpi(sql, [
        companyName,
        year,
        venueName,
        monthNumber,
      ]);
    } catch (error) {
      console.error('Error al obtener ingresos por categoría:', error);
      return {
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      };
    }
  }

  /**
   * GET /database/resultado-semanal/ingresos-totales-por-restaurante
   * Resultado Semanal: Ingresos Totales (un restaurante)
   * RESULTADO SEMANAL
   */
  @Get('resultado-semanal/ingresos-totales-por-restaurante')
  @ApiOperation({
    summary:
      'Resultado Semanal: Ingresos Totales (un restaurante) RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from dwh.get_venue_income_by_period($1, $2, $3, $4, null)',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'venue_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'week_number', required: true })
  async getResultadoSemanalIngresosTotalesPorRestaurante(
    @Query('company_name') companyName: string,
    @Query('venue_name') venueName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !venueName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, venue_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.get_venue_income_by_period($1, $2, $3, $4, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      venueName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/resultado-semanal/ingresos-totales-por-restaurante
   * Resultado Semanal: Ingresos Totales (Todos los restaurantes)
   * RESULTADO SEMANAL
   */
  @Get('resultado-semanal/ingresos-totales-todos-restaurantes')
  @ApiOperation({
    summary:
      'Resultado Semanal: Ingresos Totales (Todos los restaurantes) RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_total_income_by_period($1, $2, $3, null)',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'week_number', required: true })
  async getResultadoSemanalIngresosTotales(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ): Promise<any> {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, venue_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_total_income_by_period($1, $2, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/resultado-semanal/gastos-totales
   * Resultado Semanal: Gastos Totales (todos los restaurantes)
   * RESULTADO SEMANAL
   */
  @Get('resultado-semanal/gastos-totales')
  @ApiOperation({
    summary:
      'Resultado Semanal: Gastos Totales (todos los restaurantes RESULTADO SEMANAL)',
    description:
      'Ejecuta: SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, $3, null)',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'week_number', required: true })
  async getResultadoSemanalGastosTotales(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/resultado-semanal/gastos-totales-por-restaurante
   * Resultado Semanal: Gastos Totales (un restaurante)
   * RESULTADO SEMANAL
   */
  @Get('resultado-semanal/gastos-totales-por-restaurante')
  @ApiOperation({
    summary:
      'Resultado Semanal: Gastos Totales (un restaurante) RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from dwh.get_debit_variation_by_venue_and_period($1, $2, $3, $4, null)',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'venue_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'week_number', required: true })
  async getResultadoSemanalGastosTotalesPorRestaurante(
    @Query('company_name') companyName: string,
    @Query('venue_name') venueName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !venueName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, venue_name, year, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.get_debit_variation_by_venue_and_period($1, $2, $3, $4, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      venueName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/resultado-semanal/ingresos-por-turno-por-restaurante
   * Resultado Semanal: Ingresos por turno (un restaurante)
   * RESULTADO SEMANAL
   */
  @Get('resultado-semanal/ingresos-por-turno-por-restaurante')
  @ApiOperation({
    summary:
      'Resultado Semanal: Ingresos por turno (un restaurante) RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_sales_comparison_by_section($1, $2, $3, $4, null)',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'venue_name', required: true })
  @ApiQuery({ name: 'week_number', required: true })
  async getResultadoSemanalIngresosPorTurnoPorRestaurante(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('venue_name') venueName: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !venueName || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, venue_name, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_sales_comparison_by_section($1, $2, $3, $4, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      venueName,
      weekNumber,
    ]);
  }
  /**
   * GET /database/resultado-semanal/ingresos-por-turno-por-restaurante
   * Resultado Semanal: Ingresos por turno (un restaurante)
   * RESULTADO SEMANAL
   */
  @Get('resultado-semanal/ingresos-por-turno-todos-restaurante')
  @ApiOperation({
    summary:
      'Resultado Semanal: Ingresos por turno (todos los restaurantes) RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from  dwh.fn_sales_comparison_by_section($1, $2, $3, $4, null)',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'week_number', required: true })
  async getResultadoSemanalIngresosPorTurno(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, venue_name, week_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_sales_comparison_by_section($1, $2, null, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }

  /**
   * GET /database/vista-general/ingresos-totales
   * Vista General: Ingresos Totales (todos los restaurantes, mensual)
   * VISTA GENERAL
   */
  @Get('vista-general/ingresos-totales')
  @ApiOperation({
    summary:
      'Vista General: Ingresos Totales (todos los restaurantes) VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_total_income_by_period($1, $2, null, $3)',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'month_number', required: true })
  async getVistaGeneralIngresosTotales(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, month_number',
      };
    }
    const sql = 'SELECT * from dwh.fn_total_income_by_period($1, $2, null, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      monthNumber,
    ]);
  }

  /**
   * GET /database/vista-general/ratio-personal
   * Vista General: Ratio de Personal (todos los restaurantes, mensual)
   * VISTA GENERAL
   */
  @Get('vista-general/ratio-personal')
  @ApiOperation({
    summary:
      'Vista General: Ratio de Personal (todos los restaurantes) VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_personnel_expense_ratio2($1, $2, null, null, $3)',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'month_number', required: true })
  async getVistaGeneralRatioPersonal(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_personnel_expense_ratio2($1, $2, null, null, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      monthNumber,
    ]);
  }

  /**
   * GET /database/vista-general/ratio-personal-por-restaurante
   * Vista General: Ratio de Personal (un restaurante, mensual)
   * VISTA GENERAL
   */
  @Get('vista-general/Metri-RH-rp-pg-cd')
  @ApiOperation({
    summary: 'Vista General: Ratio de Personal (un restaurante) Proporcion de gasto sobre ingresos(HR), Coste por Departamento(HR), VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_personnel_expense_ratio2($1, $2, $3, null, $4)',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'venue_name', required: true })
  @ApiQuery({ name: 'month_number', required: true })
  async getVistaGeneralRatioPersonalPorRestaurante(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('venue_name') venueName: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !venueName || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, venue_name, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_personnel_expense_ratio2($1, $2, $3, null, $4)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      venueName,
      monthNumber,
    ]);
  }

  /// Vista General: Coste por Departamento (HR) VISTA GENERAL
  @Get('vista-general/Coste-por-departamento')
  @ApiOperation({
    summary: 'Vista General: Coste por Departamento (HR) VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_personnel_expense_ratio2(:p_company_name, :p_year, :p_venue_name, null, :p_month_number);',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'venue_name', required: true })
  @ApiQuery({ name: 'month_number', required: true })
  async getVistaGeneralCostePorDepartamento(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('venue_name') venueName: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !venueName || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, venue_name, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_personnel_expense_ratio2($1, $2, $3, null, $4)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      venueName,
      monthNumber,
    ]);
  }

  //
  @Get('vista-general/Proporcion-gastos-sobre-ingresos')
  @ApiOperation({
    summary: 'Vista General: Proporcion de gasto sobre ingresos (HR) VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_personnel_expense_ratio2(:p_company_name, :p_year, :p_venue_name, null, :p_month_number);',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'venue_name', required: true })
  @ApiQuery({ name: 'month_number', required: true })
  async getVistaGeneralProporcionGastosSobreIngresos(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('venue_name') venueName: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !venueName || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, venue_name, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_personnel_expense_ratio2($1, $2, $3, null, $4)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      venueName,
      monthNumber,
    ]);
  } 
  // vista general: Metrica de RH: Proporcion de gasto sobre ingresos(HR), Coste por Departamento(HR) y Ratio de Personal(HR) de todos los restaurantes
  @Get('vista-general/Metrica-RH-todos-restaurantes')
  @ApiOperation({
    summary: 'Vista General: Metrica de RH: Proporcion de gasto sobre ingresos(HR), Coste por Departamento(HR) y Ratio de Personal(HR) de todos los restaurantes VISTA GENERAL',
    description:
      'Ejecuta: SELECT * from dwh.fn_personnel_expense_ratio2(:p_company_name, :p_year, null, null, :p_month_number);',
  })
  @ApiQuery({ name: 'company_name', required: true })
  @ApiQuery({ name: 'year', required: true })
  //@ApiQuery({ name: 'venue_name', required: true })
  @ApiQuery({ name: 'month_number', required: true })
  async getVistaGeneralProporcionMetricaRH(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    //@Query('venue_name') venueName: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !monthNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, venue_name, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.fn_personnel_expense_ratio2($1, $2, null, null, $3)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      monthNumber,
    ]);
  }
  //RESULTADO SEMANAL: Gastos Totales por Categoría
  @Get('kpi/gastos-totales-por-categoria-resultado-semanal')
  @ApiOperation({
  summary: 'KPI: Gastos Totales por Categoría RESULTADO SEMANAL',
    description:
      'Ejecuta: SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
    example: 'PALLAPIZZA',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 30 )',
    example: '30',
  })
  async getGastosTotalesPorCategoriaResultadoSemanal(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return {
        success: false,
        message:
          'Faltan parámetros requeridos: company_name, year, month_number',
      };
    }
    const sql =
      'SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }
}
