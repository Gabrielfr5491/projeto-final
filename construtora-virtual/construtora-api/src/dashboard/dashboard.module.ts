import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Obra } from '../obras/entities/obra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Obra
    ])
  ],
  controllers: [
    DashboardController
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule {}