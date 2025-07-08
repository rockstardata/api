import { Module } from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { AgreementsController } from './agreements.controller';

@Module({
  controllers: [AgreementsController],
  providers: [AgreementsService],
})
export class AgreementsModule {}
