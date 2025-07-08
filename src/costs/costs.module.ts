import { Module } from '@nestjs/common';
import { CostsService } from './costs.service';
import { CostsController } from './costs.controller';

@Module({
  controllers: [CostsController],
  providers: [CostsService],
})
export class CostsModule {}
