import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Obra } from '../obras/entities/obra.entity';
import { Funcionario } from '../funcionarios/entities/funcionario.entity';
import { Fornecedor } from '../fornecedores/entities/fornecedore.entity';
import { Material } from '../materiais/entities/materiai.entity';
import { Equipamento } from '../equipamentos/entities/equipamento.entity';
import { Custo } from '../custos/entities/custo.entity';

@Injectable()
export class DashboardService {

  constructor(

    @InjectRepository(Obra)
    private obraRepository: Repository<Obra>,

    @InjectRepository(Funcionario)
    private funcionarioRepository:
    Repository<Funcionario>,

    @InjectRepository(Fornecedor)
    private fornecedorRepository:
    Repository<Fornecedor>,

    @InjectRepository(Material)
    private materialRepository:
    Repository<Material>,

    @InjectRepository(Equipamento)
    private equipamentoRepository:
    Repository<Equipamento>,

    @InjectRepository(Custo)
    private custoRepository:
    Repository<Custo>

  ) {}

  async resumo() {

    const obras =
      await this.obraRepository.count();

    const funcionarios =
      await this.funcionarioRepository.count();

    const fornecedores =
      await this.fornecedorRepository.count();

    const materiais =
      await this.materialRepository.count();

    const equipamentos =
      await this.equipamentoRepository.count();

    const custos =
      await this.custoRepository.find();

    let receitas = 0;
    let despesas = 0;

    custos.forEach(custo => {

      if (custo.tipo === 'Entrada') {

        receitas += Number(custo.valor);

      } else {

        despesas += Number(custo.valor);

      }

    });

    return {

      obras,

      funcionarios,

      fornecedores,

      materiais,

      equipamentos,

      receitas,

      despesas,

      lucro:
        receitas - despesas

    };

  }

  async dashboardFinanceiro() {

    const custos =
      await this.custoRepository.find();

    const totalCustos =
      custos.reduce(

        (acc, custo) =>

          acc + Number(custo.valor),

        0

      );

    const custosPorCategoria =
      custos.reduce((acc, custo) => {

        const categoria =
          custo.categoria;

        if (!acc[categoria]) {

          acc[categoria] = 0;

        }

        acc[categoria] +=
          Number(custo.valor);

        return acc;

      }, {} as any);

    return {

      totalCustos,

      custosPorCategoria

    };

  }

}

