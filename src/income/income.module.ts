import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from 'src/auth/entities/user-permission.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserPermission])],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}