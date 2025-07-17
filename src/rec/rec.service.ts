import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RecService {
  constructor(
    @Optional()
    @InjectDataSource('external')
    private readonly externalDataSource?: DataSource,
  ) {
    console.log('RecService externalDataSource:', !!externalDataSource);
  }

  async queryExternalDb(sql: string): Promise<any> {
    if (!this.externalDataSource) {
      throw new Error('No hay conexión configurada a la base de datos externa');
    }
    return this.externalDataSource.query(sql);
  }

  async getBeneficioEstimado(companyName: string, year: number, weekNumber: number): Promise<any> {
    if (!this.externalDataSource) {
      throw new Error('No hay conexión configurada a la base de datos externa');
    }
    const sql = 'SELECT * from dwh.fn_estimated_profit_by_company_and_period($1, $2, $3, null)';
    return this.externalDataSource.query(sql, [companyName, year, weekNumber]);
  }

  async testExternalConnection(): Promise<any> {
    if (!this.externalDataSource) {
      return { success: false, message: 'No hay conexión configurada a la base de datos externa' };
    }
    try {
      await this.externalDataSource.query('SELECT 1');
      return { success: true, message: 'Conexión a la base de datos externa exitosa desde RecService' };
    } catch (error) {
      return { success: false, message: 'Error al conectar a la base de datos externa desde RecService', error: error.message };
    }
  }
} 