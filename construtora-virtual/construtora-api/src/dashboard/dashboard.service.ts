import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Obra } from '../obras/entities/obra.entity';

@Injectable()
export class DashboardService {

  constructor(
    @InjectRepository(Obra)
    private obraRepository: Repository<Obra>,
  ) {}

  async resumo() {

    const obras =
      await this.obraRepository.find();

    return {

      totalObras:
        obras.length,

      obrasAndamento:
        obras.filter(
          obra =>
            obra.status ===
            'Em andamento'
        ).length,

      obrasConcluidas:
        obras.filter(
          obra =>
            obra.status ===
            'Concluída'
        ).length,

      investimentoTotal:
        obras.reduce(
          (total, obra) =>
            total +
            Number(obra.orcamento),
          0
        )

    };

  }

}