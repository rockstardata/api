import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';
import { Venue } from './entities/venue.entity';
import { SyncService } from '../database/sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Venue])],
  controllers: [VenueController],
  providers: [VenueService, SyncService],
  exports: [VenueService],
})
export class VenueModule {}
