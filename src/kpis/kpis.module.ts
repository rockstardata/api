import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpisService } from './kpis.service';
import { KpisController } from './kpis.controller';
import { Kpi } from './entities/kpi.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kpi, Venue, User]),
  ],
  controllers: [KpisController],
  providers: [KpisService, SyncService],
  exports: [KpisService],
})
export class KpisModule {}
