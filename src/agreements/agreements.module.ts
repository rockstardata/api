import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreementsService } from './agreements.service';
import { AgreementsController } from './agreements.controller';
import { Agreement } from './entities/agreement.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agreement, Venue, User]),
  ],
  controllers: [AgreementsController],
  providers: [AgreementsService, SyncService],
  exports: [AgreementsService],
})
export class AgreementsModule {}
