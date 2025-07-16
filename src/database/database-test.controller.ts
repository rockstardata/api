import {
  Controller,
  Post,
  Get,
  Logger,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('database-test')
export class DatabaseTestController {
  private readonly logger = new Logger(DatabaseTestController.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get('status')
  async getDatabaseStatus() {
    try {
      // Verificar conexión a la base de datos
      await this.dataSource.query('SELECT 1');
      
      // Obtener estadísticas básicas
      const venueCount = await this.dataSource.query('SELECT COUNT(*) FROM venue');
      const incomeCount = await this.dataSource.query('SELECT COUNT(*) FROM income');
      const salesCount = await this.dataSource.query('SELECT COUNT(*) FROM sale');
      
      return {
        success: true,
        message: 'Base de datos conectada correctamente',
        stats: {
          venues: parseInt(venueCount[0].count),
          incomes: parseInt(incomeCount[0].count),
          sales: parseInt(salesCount[0].count),
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error conectando a la base de datos',
        error: error.message,
      };
    }
  }

  @Post('create-simple-test-data')
  async createSimpleTestData() {
    try {
      // Verificar si ya existen venues
      const existingVenues = await this.dataSource.query('SELECT id, name FROM venue LIMIT 5');
      
      if (existingVenues.length === 0) {
        // Crear un venue de prueba si no existe ninguno
        await this.dataSource.query(`
          INSERT INTO venue (name, description, address, phone, email, "isActive", "createdAt", "updatedAt", "companyId")
          VALUES ('Restaurante de Prueba', 'Restaurante para pruebas', 'Calle Test 123', '123456789', 'test@restaurant.com', true, NOW(), NOW(), 1)
        `);
      }

      // Crear algunos ingresos de prueba
      const testIncomes = [
        {
          name: 'Venta de tickets evento rock',
          amount: 100.00,
          category: 'ticket_sales',
          status: 'received',
          date: '2025-01-15',
          venueId: existingVenues.length > 0 ? existingVenues[0].id : 1,
        },
        {
          name: 'Bar y bebidas',
          amount: 40.00,
          category: 'food_beverage',
          status: 'received',
          date: '2025-01-20',
          venueId: existingVenues.length > 0 ? existingVenues[0].id : 1,
        },
        {
          name: 'Venta de tickets evento 2024',
          amount: 120.00,
          category: 'ticket_sales',
          status: 'received',
          date: '2024-01-15',
          venueId: existingVenues.length > 0 ? existingVenues[0].id : 1,
        }
      ];

      let insertedCount = 0;
      for (const income of testIncomes) {
        try {
          await this.dataSource.query(`
            INSERT INTO income (name, amount, category, status, date, "venueId", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          `, [income.name, income.amount, income.category, income.status, income.date, income.venueId]);
          insertedCount++;
        } catch (error) {
          this.logger.warn(`Error insertando ingreso: ${error.message}`);
        }
      }

      return {
        success: true,
        message: 'Datos de prueba creados correctamente',
        insertedIncomes: insertedCount,
        existingVenues: existingVenues.length,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creando datos de prueba',
        error: error.message,
      };
    }
  }

  @Get('venues')
  async getVenues() {
    try {
      const venues = await this.dataSource.query('SELECT id, name, description FROM venue ORDER BY id');
      return {
        success: true,
        venues: venues,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error obteniendo venues',
        error: error.message,
      };
    }
  }
} 