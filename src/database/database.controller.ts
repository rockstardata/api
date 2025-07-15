import {
  Controller,
  Logger,
  Optional,
  Post,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { exec } from 'child_process';
import { UsersService } from '../users/users.service';

@Controller('database')
export class DatabaseController {
  private readonly logger = new Logger(DatabaseController.name);

  constructor(
    private readonly syncService: SyncService,
    private readonly usersService: UsersService,
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
}
