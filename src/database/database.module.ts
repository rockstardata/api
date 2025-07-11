import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';

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
    ...(process.env.EXTERNAL_DB_HOST ? [
      TypeOrmModule.forRootAsync({
        name: 'external',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres', // Cambiar según tu BD externa
          host: configService.get<string>('EXTERNAL_DB_HOST'),
          port: configService.get<number>('EXTERNAL_DB_PORT'),
          username: configService.get<string>('EXTERNAL_DB_USERNAME'),
          password: configService.get<string>('EXTERNAL_DB_PASSWORD'),
          database: configService.get<string>('EXTERNAL_DB_DATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false, // Importante: false para BD externa
          logging: false,
          ssl: configService.get<boolean>('EXTERNAL_DB_SSL', false),
        }),
      })
    ] : []),
  ],
  providers: [SyncService],
  exports: [SyncService],
})
export class DatabaseModule {}
