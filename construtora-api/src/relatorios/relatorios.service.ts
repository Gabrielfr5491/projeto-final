import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Custo } from '../custos/entities/custo.entity';

@Injectable()
export class RelatoriosService {

  constructor(

    @InjectRepository(Custo)
    private custoRepository:
    Repository<Custo>

  ) {}

  async custosPorObra() {

    const custos =
      await this.custoRepository.find();

    const resultado: any = {};

    custos.forEach(custo => {

      const nomeObra =
        custo.obra?.nome || 'Sem Obra';

      if (!resultado[nomeObra]) {

        resultado[nomeObra] = 0;

      }

      resultado[nomeObra] +=
        Number(custo.valor);

    });

    return resultado;

  }

}