import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { SyncService } from '../database/sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Sale, Venue])],
  controllers: [TicketsController],
  providers: [TicketsService, SyncService],
  exports: [TicketsService],
})
export class TicketsModule {}
