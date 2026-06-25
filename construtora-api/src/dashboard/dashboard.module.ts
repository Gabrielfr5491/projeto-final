import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Obra } from '../obras/entities/obra.entity';
import { Funcionario } from '../funcionarios/entities/funcionario.entity';
import { Fornecedor } from '../fornecedores/entities/fornecedore.entity';
import { Material } from '../materiais/entities/materiai.entity';
import { Equipamento } from '../equipamentos/entities/equipamento.entity';
import { Custo } from '../custos/entities/custo.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Obra,
      Funcionario,
      Fornecedor,
      Material,
      Equipamento,
      Custo
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