import { Module } from '@nestjs/common';
import { KpisService } from './kpis.service';
import { KpisController } from './kpis.controller';

@Module({
  controllers: [KpisController],
  providers: [KpisService],
})
export class KpisModule {}
