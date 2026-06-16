import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';

import { Custo } from '../custos/entities/custo.entity';

@Module({

  imports: [

    TypeOrmModule.forFeature([
      Custo
    ])

  ],

  controllers: [
    RelatoriosController
  ],

  providers: [
    RelatoriosService
  ]

})
export class RelatoriosModule {}