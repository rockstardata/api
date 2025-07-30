import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SyncService } from '../database/sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Venue]), AuthModule],
  controllers: [SalesController],
  providers: [SalesService, SyncService],
  exports: [SalesService],
})
export class SalesModule {}
