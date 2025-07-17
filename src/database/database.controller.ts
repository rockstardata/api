import {
  Controller,
  Logger,
  Optional,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { exec } from 'child_process';
import { UsersService } from '../users/users.service';
import { VenueService } from '../venue/venue.service';
import { IncomeService } from '../income/income.service';
import { SalesService } from '../sales/sales.service';
import { IncomeCategory, IncomeStatus } from '../income/entities/income.entity';

@Controller('database')
export class DatabaseController {
  private readonly logger = new Logger(DatabaseController.name);

  constructor(
    private readonly syncService: SyncService,
    private readonly usersService: UsersService,
    private readonly venueService: VenueService,
    private readonly incomeService: IncomeService,
    private readonly salesService: SalesService,
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

  @Post('update-sale-dates')
  async updateSaleDates() {
    return new Promise((resolve) => {
      const { exec } = require('child_process');
      exec(
        'node scripts/update-sale-dates.js',
        { cwd: process.cwd() },
        (error, stdout, stderr) => {
          if (error) {
            this.logger.error('Error ejecutando update-sale-dates.js', error);
            resolve({
              success: false,
              message: 'Error actualizando fechas de sales',
              error: error.message,
              stderr,
              stdout,
            });
          } else {
            resolve({
              success: true,
              message: 'Fechas de sales actualizadas correctamente',
              stdout,
              stderr,
            });
          }
        },
      );
    });
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
          price: 50.00,
          totalAmount: 100.00,
          venueId: venue.id,
          createdAt: new Date('2025-01-15'),
        },
        {
          productName: 'Bebidas',
          quantity: 5,
          price: 8.00,
          totalAmount: 40.00,
          venueId: venue.id,
          createdAt: new Date('2025-01-20'),
        },
        {
          productName: 'Ticket Evento 2024',
          quantity: 3,
          price: 40.00,
          totalAmount: 120.00,
          venueId: venue.id,
          createdAt: new Date('2024-01-15'),
        }
      ];

      // Crear ingresos de prueba
      const incomes = [
        {
          name: 'Venta de tickets evento rock',
          amount: 100.00,
          category: 'ticket_sales',
          status: 'received',
          date: '2025-01-15',
          venueId: venue.id,
        },
        {
          name: 'Bar y bebidas',
          amount: 40.00,
          category: 'food_beverage',
          status: 'received',
          date: '2025-01-20',
          venueId: venue.id,
        },
        {
          name: 'Venta de tickets evento 2024',
          amount: 120.00,
          category: 'ticket_sales',
          status: 'received',
          date: '2024-01-15',
          venueId: venue.id,
        }
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

  @Post('sync-incomes-from-sales')
  async syncIncomesFromSales() {
    // Buscar todas las ventas
    const sales = await this.salesService.findAll();
    let created = 0;
    let alreadyLinked = 0;
    for (const sale of sales) {
      // Verificar si ya existe un ingreso asociado a esta venta
      const existingIncome = await this.incomeService.findBySaleId(sale.id);
      if (existingIncome) {
        alreadyLinked++;
        continue;
      }
      // Crear ingreso asociado a la venta
      const incomeData = {
        name: `Venta: ${sale.productName}`,
        amount: sale.totalAmount,
        category: IncomeCategory.TICKET_SALES,
        status: IncomeStatus.RECEIVED,
        date: sale.createdAt ? sale.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        venueId: sale.venue?.id,
        saleId: sale.id,
      };
      await this.incomeService.create(incomeData, 1); // userId 1 (admin)
      created++;
    }
    return {
      success: true,
      message: 'Sincronización de ingresos desde ventas completada',
      created,
      alreadyLinked,
      totalSales: sales.length,
    };
  }

  @Get('kpi/beneficio-estimado')
  async getBeneficioEstimado(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return { success: false, message: 'Faltan parámetros requeridos: company_name, year, week_number' };
    }
    const sql = 'SELECT * from dwh.fn_estimated_profit_by_company_and_period($1, $2, $3, null)';
    return this.syncService.queryExternalKpi(sql, [companyName, year, weekNumber]);
  }

  @Get('kpi/ingresos-totales')
  async getIngresosTotales(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return { success: false, message: 'Faltan parámetros requeridos: company_name, year, week_number' };
    }
    const sql = 'SELECT * from dwh.fn_total_income_by_period($1, $2, $3, null)';
    return this.syncService.queryExternalKpi(sql, [companyName, year, weekNumber]);
  }

  @Get('kpi/gastos-totales')
  async getGastosTotales(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return { success: false, message: 'Faltan parámetros requeridos: company_name, year, week_number' };
    }
    const sql = 'SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, $3, null)';
    return this.syncService.queryExternalKpi(sql, [companyName, year, weekNumber]);
  }

  @Get('kpi/beneficio-estimado-por-local')
  async getBeneficioEstimadoPorLocal(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return { success: false, message: 'Faltan parámetros requeridos: company_name, year, week_number' };
    }
    const sql = 'SELECT * from dwh.fn_estimated_profit_by_venues_and_week($1, $2, $3)';
    return this.syncService.queryExternalKpi(sql, [companyName, year, weekNumber]);
  }

  @Get('kpi/gastos-totales-por-categoria')
  async getGastosTotalesPorCategoria(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('month_number') monthNumber: string,
  ) {
    if (!companyName || !year || !monthNumber) {
      return { success: false, message: 'Faltan parámetros requeridos: company_name, year, month_number' };
    }
    const sql = 'SELECT * from dwh.get_debit_variation_by_company_and_period($1, $2, null, $3)';
    return this.syncService.queryExternalKpi(sql, [companyName, year, monthNumber]);
  }

  @Get('kpi/ingresos-por-turno')
  async getIngresosPorTurno(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return { success: false, message: 'Faltan parámetros requeridos: company_name, year, week_number' };
    }
    const sql = 'SELECT * from dwh.fn_sales_comparison_by_section($1, $2, null, $3, null)';
    return this.syncService.queryExternalKpi(sql, [companyName, year, weekNumber]);
  }

  @Get('kpi/ratio-personal')
  async getRatioPersonal(
    @Query('company_name') companyName: string,
    @Query('year') year: string,
    @Query('week_number') weekNumber: string,
  ) {
    if (!companyName || !year || !weekNumber) {
      return { success: false, message: 'Faltan parámetros requeridos: company_name, year, week_number' };
    }
    const sql = 'SELECT * from dwh.fn_personnel_expense_ratio($1, $2, null, $3, null)';
    return this.syncService.queryExternalKpi(sql, [companyName, year, weekNumber]);
  }

  @Get('kpi/comensales-totales')
  async getComensalesTotales(
    @Query('company_name') companyName: string,
    @Query('week_number') weekNumber: string,
    @Query('year') year: string,
  ) {
    if (!companyName || !weekNumber || !year) {
      return { success: false, message: 'Faltan parámetros requeridos: company_name, week_number, year' };
    }
    const sql = 'SELECT * from dwh.fn_week_total_attendees($1, $2, $3)';
    return this.syncService.queryExternalKpi(sql, [companyName, weekNumber, year]);
  }
}
