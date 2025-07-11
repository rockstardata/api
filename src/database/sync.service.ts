import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private externalDataSource: DataSource | null = null;

  constructor(
    @Optional()
    @InjectDataSource('external')
    externalDataSource?: DataSource,
  ) {
    this.externalDataSource = externalDataSource || null;
  }

  /**
   * Sincroniza una entidad con la base de datos externa
   * @param entityName Nombre de la entidad
   * @param operation Tipo de operación (create, update, delete)
   * @param data Datos a sincronizar
   */
  async syncEntity(
    entityName: string,
    operation: 'create' | 'update' | 'delete',
    data: any,
  ): Promise<void> {
    // Verificar si la base de datos externa está configurada
    if (!this.externalDataSource) {
      this.logger.debug('External database not configured, skipping sync');
      return;
    }

    try {
      const externalRepo = this.externalDataSource.getRepository(entityName);
      
      switch (operation) {
        case 'create':
          await externalRepo.save(data);
          this.logger.log(`Synced ${entityName} creation to external DB`);
          break;
          
        case 'update':
          await externalRepo.update(data.id, data);
          this.logger.log(`Synced ${entityName} update to external DB`);
          break;
          
        case 'delete':
          await externalRepo.delete(data.id);
          this.logger.log(`Synced ${entityName} deletion to external DB`);
          break;
      }
    } catch (error) {
      this.logger.error(
        `Failed to sync ${entityName} ${operation} to external DB: ${error.message}`,
        error.stack,
      );
      // No lanzar el error para no afectar la operación principal
    }
  }

  /**
   * Sincroniza múltiples entidades en una transacción
   */
  async syncMultipleEntities(operations: Array<{
    entityName: string;
    operation: 'create' | 'update' | 'delete';
    data: any;
  }>): Promise<void> {
    // Verificar si la base de datos externa está configurada
    if (!this.externalDataSource) {
      this.logger.debug('External database not configured, skipping multiple sync');
      return;
    }

    const queryRunner = this.externalDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const op of operations) {
        await this.syncEntity(op.entityName, op.operation, op.data);
      }
      
      await queryRunner.commitTransaction();
      this.logger.log('Successfully synced multiple entities to external DB');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to sync multiple entities, rolled back', error);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Verifica la conectividad con la base de datos externa
   */
  async checkExternalConnection(): Promise<boolean> {
    if (!this.externalDataSource) {
      this.logger.debug('External database not configured');
      return false;
    }

    try {
      await this.externalDataSource.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('External database connection failed', error);
      return false;
    }
  }
} 