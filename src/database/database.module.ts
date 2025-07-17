import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { DatabaseController } from './database.controller';
import { DatabaseTestController } from './database-test.controller';
import { UsersModule } from '../users/users.module';
import { VenueModule } from '../venue/venue.module';
import { IncomeModule } from '../income/income.module';
import { SalesModule } from '../sales/sales.module';

console.log('EXTERNAL_DB_HOST en DatabaseModule:', process.env.EXTERNAL_DB_HOST);
@Module({
  imports: [
    // Base de datos principal (tu configuración actual)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    // Base de datos externa (solo si está configurada)
    ...(process.env.EXTERNAL_DB_HOST
      ? [
          TypeOrmModule.forRootAsync({
            name: 'external',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
              const config: TypeOrmModuleOptions = {
                type: 'postgres',
                host: configService.get<string>('EXTERNAL_DB_HOST'),
                port: configService.get<number>('EXTERNAL_DB_PORT'),
                username: configService.get<string>('EXTERNAL_DB_USERNAME'),
                password: configService.get<string>('EXTERNAL_DB_PASSWORD'),
                database: configService.get<string>('EXTERNAL_DB_DATABASE'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                schema: 'dwh',
                synchronize: false, // Importante: false para BD externa
                logging: false,
                ssl: { rejectUnauthorized: false },
              };
              console.log('Creando conexión externa con:', config);
              return config;
            },
          }),
        ]
      : []),
    UsersModule,
    VenueModule,
    IncomeModule,
    SalesModule,
  ],
  controllers: [DatabaseController, DatabaseTestController],
  providers: [SyncService],
  exports: [SyncService, TypeOrmModule],
})
export class DatabaseModule {}
