import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecService } from './rec.service';
import { PaymentsController } from './rec.controller';

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController],
  providers: [RecService],
})
export class RecModule {}
