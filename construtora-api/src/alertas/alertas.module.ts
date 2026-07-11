import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlertasController } from './alertas.controller';
import { AlertasService } from './alertas.service';

import { Obra } from '../obras/entities/obra.entity';
import { Custo } from '../custos/entities/custo.entity';
import { Material } from '../materiais/entities/materiai.entity';
import { Equipamento } from '../equipamentos/entities/equipamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Obra,
      Custo,
      Material,
      Equipamento,
    ]),
  ],
  controllers: [AlertasController],
  providers: [AlertasService],
})
export class AlertasModule {}
