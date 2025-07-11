import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { Income } from './entities/income.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Income, Venue, Sale, User]),
  ],
  controllers: [IncomeController],
  providers: [IncomeService, SyncService],
  exports: [IncomeService],
})
export class IncomeModule {}