import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';

import { Custo } from '../custos/entities/custo.entity';
import { Obra } from '../obras/entities/obra.entity';
import { Funcionario } from '../funcionarios/entities/funcionario.entity';
import { Material } from '../materiais/entities/materiai.entity';
import { Equipamento } from '../equipamentos/entities/equipamento.entity';

@Module({

  imports: [
    TypeOrmModule.forFeature([
      Custo,
      Obra,
      Funcionario,
      Material,
      Equipamento,
    ])
  ],

  controllers: [RelatoriosController],
  providers: [RelatoriosService],

})
export class RelatoriosModule {}
