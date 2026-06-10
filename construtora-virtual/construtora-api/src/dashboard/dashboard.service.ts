import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Obra } from '../obras/entities/obra.entity';

@Injectable()
export class DashboardService {

  constructor(
    @InjectRepository(Obra)
    private obraRepository: Repository<Obra>
  ) {}

  async resumo() {

    const obras =
      await this.obraRepository.find();

    const totalObras =
      obras.length;

    const concluidas =
      obras.filter(
        o => o.status === 'Concluída'
      ).length;

    const planejamento =
      obras.filter(
        o => o.status === 'Planejamento'
      ).length;

    const andamento =
      obras.filter(
        o => o.status === 'Em andamento'
      ).length;

    const orcamentoTotal =
      obras.reduce(
        (soma, obra) =>
          soma + Number(obra.orcamento),
        0
      );

    return {

      totalObras,

      concluidas,

      planejamento,

      andamento,

      orcamentoTotal

    };

  }

}