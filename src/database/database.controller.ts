import { Controller, Get, Logger, Optional, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  ) {}

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
  async createSuperAdminUser() {
    const dto = {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@rockstardata.ai',
      password: 'Admin.2025',
    };
    try {
      const user = await this.usersService.createSuperAdmin(dto, 1);
      return {
        success: true,
        message: 'SuperAdmin creado',
        user: {
          id: user.id,
          email: user.email,
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

  @Post('create-test-data')
  async createTestData() {
    try {
      // Crear un restaurante de prueba
      const venue = await this.venueService.create({
        name: 'Restaurante de Prueba',
        description: 'Restaurante para pruebas',
        address: 'Calle Test 123',
        phone: '123456789',
        email: 'test@restaurant.com',
        companyId: 1, // Asumiendo que existe una compañía con ID 1
      });

      // Crear ventas de prueba
      const sales = [
        {
          productName: 'Ticket Evento Rock',
          quantity: 2,
          price: 50.0,
          totalAmount: 100.0,
          venueId: venue.id,
          createdAt: new Date('2025-01-15'),
        },
        {
          productName: 'Bebidas',
          quantity: 5,
          price: 8.0,
          totalAmount: 40.0,
          venueId: venue.id,
          createdAt: new Date('2025-01-20'),
        },
        {
          productName: 'Ticket Evento 2024',
          quantity: 3,
          price: 40.0,
          totalAmount: 120.0,
          venueId: venue.id,
          createdAt: new Date('2024-01-15'),
        },
      ];

      // Crear ingresos de prueba
      const incomes = [
        {
          name: 'Venta de tickets evento rock',
          amount: 100.0,
          category: 'ticket_sales',
          status: 'received',
          date: '2025-01-15',
          venueId: venue.id,
        },
        {
          name: 'Bar y bebidas',
          amount: 40.0,
          category: 'food_beverage',
          status: 'received',
          date: '2025-01-20',
          venueId: venue.id,
        },
        {
          name: 'Venta de tickets evento 2024',
          amount: 120.0,
          category: 'ticket_sales',
          status: 'received',
          date: '2024-01-15',
          venueId: venue.id,
        },
      ];

      return {
        success: true,
        message: 'Datos de prueba creados correctamente',
        venue: venue,
        salesCount: sales.length,
        incomesCount: incomes.length,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creando datos de prueba',
        error: error.message,
      };
    }
  }

  /**
   * KPI: Beneficio Estimado
   * Query: SELECT * from dwh.fn_estimated_profit_by_company_and_period($1, $2, $3, null)
   * Params: company_name, year, week_number
   */
  @Get('kpi/beneficio-estimado')
  @ApiOperation({
    summary: 'KPI: Beneficio Estimado',
    description:
      'Ejecuta: SELECT * from dwh.fn_estimated_profit_by_company_and_period($1, $2, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
   * KPI: Ingresos Totales
   * Query: SELECT * from dwh.fn_total_income_by_period($1, $2, $3, null)
   * Params: company_name, year, week_number
   */
  @Get('kpi/ingresos-totales')
  @ApiOperation({
    summary: 'KPI: Ingresos Totales',
    description:
      'Ejecuta: SELECT * from dwh.fn_total_income_by_period($1, $2, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
   * KPI: Gastos Totales
   * Query: SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, $3, null)
   * Params: company_name, year, week_number
   */
  @Get('kpi/gastos-totales')
  @ApiOperation({
    summary: 'KPI: Gastos Totales',
    description:
      'Ejecuta: SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
  })
  async getGastosTotales(
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
   * KPI: Beneficio Estimado por Local
   * Query: SELECT * from dwh.fn_estimated_profit_by_venues_and_week($1, $2, $3)
   * Params: company_name, year, week_number
   */
  @Get('kpi/beneficio-estimado-por-local')
  @ApiOperation({
    summary: 'KPI: Beneficio Estimado por Local',
    description:
      'Ejecuta: SELECT * from dwh.fn_estimated_profit_by_venues_and_week($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
   * KPI: Gastos Totales por Categoría
   * Query: SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, null, $3)
   * Params: company_name, year, month_number
   */
  @Get('kpi/gastos-totales-por-categoria')
  @ApiOperation({
    summary: 'KPI: Gastos Totales por Categoría',
    description:
      'Ejecuta: SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, null, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'month_number',
    required: true,
    description: 'Número de mes (ej: 6 para junio)',
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
   * KPI: Ingresos por Turno
   * Query: SELECT * from dwh.fn_sales_comparison_by_section($1, $2, null, $3, null)
   * Params: company_name, year, week_number
   */
  @Get('kpi/ingresos-por-turno')
  @ApiOperation({
    summary: 'KPI: Ingresos por Turno',
    description:
      'Ejecuta: SELECT * from dwh.fn_sales_comparison_by_section($1, $2, null, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
   * KPI: Ratio Personal (un restaurante)
   * Query: SELECT * from dwh.fn_personnel_expense_ratio($1, $2, $3, $4, null)
   * Params: company_name, year, venue_name, week_number
   */
  @Get('kpi/ratio-personal')
  @ApiOperation({
    summary: 'KPI: Ratio Personal (un restaurante)',
    description:
      'Ratio de Personal (un restaurante) que es lo que retorna y la query que consume: SELECT * from dwh.fn_personnel_expense_ratio($1, $2, $3, $4, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'venue_name',
    required: true,
    description: 'Nombre del restaurante/venue',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
  })
  async getRatioPersonal(
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
      'SELECT * from dwh.fn_personnel_expense_ratio($1, $2, $3, $4, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      venueName,
      weekNumber,
    ]);
  }

  /**
   * KPI: Ratio Personal General
   * Query: SELECT * from dwh.fn_personnel_expense_ratio($1, $2, null, $3, null)
   * Params: company_name, year, week_number
   */
  @Get('kpi/ratio-personal-general')
  @ApiOperation({
    summary: 'KPI: Ratio Personal General',
    description:
      'Ejecuta: SELECT * from dwh.fn_personnel_expense_ratio($1, $2, null, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
      'SELECT * from dwh.fn_personnel_expense_ratio($1, $2, null, $3, null)';
    return this.syncService.queryExternalKpi(sql, [
      companyName,
      year,
      weekNumber,
    ]);
  }

  /**
   * KPI: Comensales Totales
   * Query: SELECT * from dwh.fn_week_total_attendees($1, $2, $3)
   * Params: company_name, week_number, year
   */
  @Get('kpi/comensales-totales')
  @ApiOperation({
    summary: 'KPI: Comensales Totales',
    description:
      'Ejecuta: SELECT * from dwh.fn_week_total_attendees($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
   * KPI: Ingresos por Restaurante (diario)
   * Query: SELECT * FROM dwh.fn_weekly_venues_income($1, $2, $3, null)
   * Params: company_name, week_number, year
   */
  @Get('kpi/ingresos-por-restaurante-diario')
  @ApiOperation({
    summary: 'KPI: Ingresos por Restaurante (diario)',
    description:
      'Ejecuta: SELECT * FROM dwh.fn_weekly_venues_income($1, $2, $3, null)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
   * KPI: Comensales por Restaurante (diario)
   * Query: SELECT * FROM dwh.fn_weekly_attendance_by_venue($1, $2, $3)
   * Params: company_name, week_number, year
   */
  @Get('kpi/comensales-por-restaurante-diario')
  @ApiOperation({
    summary: 'KPI: Comensales por Restaurante (diario)',
    description:
      'Ejecuta: SELECT * FROM dwh.fn_weekly_attendance_by_venue($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
   * KPI: Ticket Medio por Comensal
   * Query: SELECT * FROM dwh.fn_weekly_avg_income_per_attendee($1, $2, $3)
   * Params: company_name, week_number, year
   */
  @Get('kpi/ticket-medio-por-comensal')
  @ApiOperation({
    summary: 'KPI: Ticket Medio por Comensal',
    description:
      'Ejecuta: SELECT * FROM dwh.fn_weekly_avg_income_per_attendee($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
   * KPI: Ticket Medio por Comensal y Restaurante (diario)
   * Query: SELECT * FROM dwh.fn_weekly_avg_ticket_by_venue($1, $2, $3)
   * Params: company_name, week_number, year
   */
  @Get('kpi/ticket-medio-por-comensal-restaurante-diario')
  @ApiOperation({
    summary: 'KPI: Ticket Medio por Comensal y Restaurante (diario)',
    description:
      'Ejecuta: SELECT * FROM dwh.fn_weekly_avg_ticket_by_venue($1, $2, $3)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({
    name: 'week_number',
    required: true,
    description: 'Número de semana (ej: 11)',
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
   * KPI: Ingresos Totales por Restaurante
   * Query: SELECT * FROM dwh.get_venue_income_by_period($1, $2, $3, null, $4)
   * Params: company_name, venue_name, year, month_number
   */
  @Get('kpi/ingresos-totales-por-restaurante')
  @ApiOperation({
    summary: 'KPI: Ingresos Totales por Restaurante',
    description:
      'Ejecuta: SELECT * FROM dwh.get_venue_income_by_period($1, $2, $3, null, $4)',
  })
  @ApiQuery({
    name: 'company_name',
    required: true,
    description: 'Nombre de la compañía',
  })
  @ApiQuery({
    name: 'venue_name',
    required: true,
    description: 'Nombre del restaurante',
  })
  @ApiQuery({ name: 'year', required: true, description: 'Año (ej: 2024)' })
  @ApiQuery({
    name: 'month_number',
    required: true,
    description: 'Número de mes (ej: 6 para junio)',
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
}
