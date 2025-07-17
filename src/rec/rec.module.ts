import { Module } from '@nestjs/common';
import { RecController } from './rec.controller';
import { RecService } from './rec.service';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([], 'external'),
    ],
    controllers: [RecController],
    providers: [RecService],
})
export class RecModule { } 
