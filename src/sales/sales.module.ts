import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SyncService } from '../database/sync.service';
import { IncomeModule } from '../income/income.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, Ticket, Venue]),
    AuthModule,
    IncomeModule
  ],
  controllers: [SalesController],
  providers: [SalesService, SyncService],
  exports: [SalesService],
})
export class SalesModule {}
