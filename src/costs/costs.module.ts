import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostsService } from './costs.service';
import { CostsController } from './costs.controller';
import { Cost } from './entities/cost.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cost, Venue, User]),
  ],
  controllers: [CostsController],
  providers: [CostsService, SyncService],
  exports: [CostsService],
})
export class CostsModule {}
