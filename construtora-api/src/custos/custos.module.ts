import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustosController } from './custos.controller';
import { CustosService } from './custos.service';

import { Custo } from './entities/custo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Custo
    ])
  ],

  controllers: [
    CustosController
  ],

  providers: [
    CustosService
  ]
})
export class CustosModule {}