import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Obra } from '../obras/entities/obra.entity';
import { Custo } from '../custos/entities/custo.entity';
import { Material } from '../materiais/entities/materiai.entity';
import { Equipamento } from '../equipamentos/entities/equipamento.entity';

export interface Alerta {
  id: string;
  tipo: 'danger' | 'warning' | 'info';
  categoria: 'obra' | 'financeiro' | 'material' | 'equipamento';
  titulo: string;
  mensagem: string;
  link?: string;
  criadoEm: string;
}

@Injectable()
export class AlertasService {

  constructor(
    @InjectRepository(Obra)
    private obraRepository: Repository<Obra>,

    @InjectRepository(Custo)
    private custoRepository: Repository<Custo>,

    @InjectRepository(Material)
    private materialRepository: Repository<Material>,

    @InjectRepository(Equipamento)
    private equipamentoRepository: Repository<Equipamento>,
  ) {}

  async listarAlertas(): Promise<Alerta[]> {
    const alertas: Alerta[] = [];
    const hoje = new Date();
    const agora = new Date().toISOString();

    const obras = await this.obraRepository.find();
    const custos = await this.custoRepository.find({ relations: ['obra'] });

    const custosPorObraId: Record<number, number> = {};
    custos.forEach(c => {
      custosPorObraId[c.obraId] = (custosPorObraId[c.obraId] || 0) + Number(c.valor);
    });

    for (const obra of obras) {
      const isConcluida =
        obra.status === 'Concluída' ||
        obra.status === 'Concluido';

      if (isConcluida) continue;

      if (obra.dataPrevista) {
        const dataPrev = new Date(obra.dataPrevista);
        const diasAtraso = Math.ceil(
          (hoje.getTime() - dataPrev.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diasAtraso > 0) {
          alertas.push({
            id: `obra-atrasada-${obra.id}`,
            tipo: 'danger',
            categoria: 'obra',
            titulo: `Obra atrasada: ${obra.nome}`,
            mensagem: `A obra "${obra.nome}" (${obra.cidade}/${obra.estado}) está ${diasAtraso} dia(s) além da data prevista de conclusão.`,
            link: `/detalhe-obra/${obra.id}`,
            criadoEm: agora,
          });
        }

        if (diasAtraso <= 0 && Math.abs(diasAtraso) <= 15) {
          alertas.push({
            id: `obra-vencimento-${obra.id}`,
            tipo: 'warning',
            categoria: 'obra',
            titulo: `Prazo se encerrando: ${obra.nome}`,
            mensagem: `A obra "${obra.nome}" tem ${Math.abs(diasAtraso)} dia(s) restantes para conclusão.`,
            link: `/detalhe-obra/${obra.id}`,
            criadoEm: agora,
          });
        }
      }

      const custoReal = custosPorObraId[obra.id] || 0;
      const orcamento = Number(obra.orcamento);

      if (orcamento > 0 && custoReal > orcamento) {
        const excesso = custoReal - orcamento;
        const percentual = ((excesso / orcamento) * 100).toFixed(1);
        alertas.push({
          id: `obra-orcamento-${obra.id}`,
          tipo: 'danger',
          categoria: 'financeiro',
          titulo: `Orçamento estourado: ${obra.nome}`,
          mensagem: `Os custos da obra "${obra.nome}" ultrapassaram o orçamento em R$ ${excesso.toLocaleString('pt-BR')} (${percentual}% acima do previsto).`,
          link: `/custos`,
          criadoEm: agora,
        });
      }

      if (orcamento > 0 && custoReal >= orcamento * 0.8 && custoReal <= orcamento) {
        const percentual = ((custoReal / orcamento) * 100).toFixed(0);
        alertas.push({
          id: `obra-orcamento-critico-${obra.id}`,
          tipo: 'warning',
          categoria: 'financeiro',
          titulo: `Orçamento crítico: ${obra.nome}`,
          mensagem: `A obra "${obra.nome}" já consumiu ${percentual}% do orçamento disponível.`,
          link: `/custos`,
          criadoEm: agora,
        });
      }
    }

    const obrasSemData = obras.filter(
      o =>
        !o.dataInicio &&
        o.status !== 'Concluída' &&
        o.status !== 'Concluido',
    );
    for (const obra of obrasSemData) {
      alertas.push({
        id: `obra-sem-data-${obra.id}`,
        tipo: 'info',
        categoria: 'obra',
        titulo: `Obra sem data de início: ${obra.nome}`,
        mensagem: `A obra "${obra.nome}" não possui data de início cadastrada.`,
        link: `/editar-obra/${obra.id}`,
        criadoEm: agora,
      });
    }

    const materiais = await this.materialRepository.find();
    const materiaisCriticos = materiais.filter(
      m => Number(m.quantidade) <= Number(m.estoqueMinimo),
    );

    for (const mat of materiaisCriticos) {
      const tipo: 'danger' | 'warning' = Number(mat.quantidade) === 0 ? 'danger' : 'warning';
      alertas.push({
        id: `material-critico-${mat.id}`,
        tipo,
        categoria: 'material',
        titulo: `Estoque crítico: ${mat.nome}`,
        mensagem:
          Number(mat.quantidade) === 0
            ? `O material "${mat.nome}" está com estoque zerado. Reposição urgente necessária.`
            : `O material "${mat.nome}" está abaixo do estoque mínimo (${mat.quantidade} ${mat.unidade} disponível, mínimo: ${mat.estoqueMinimo} ${mat.unidade}).`,
        link: `/materiais`,
        criadoEm: agora,
      });
    }

    const equipamentos = await this.equipamentoRepository.find();
    const emManutencao = equipamentos.filter(
      e =>
        e.status?.toLowerCase().includes('manuten') ||
        e.status?.toLowerCase() === 'inativo' ||
        e.status?.toLowerCase() === 'inativa',
    );

    for (const eq of emManutencao) {
      alertas.push({
        id: `equipamento-manutencao-${eq.id}`,
        tipo: 'info',
        categoria: 'equipamento',
        titulo: `Equipamento indisponível: ${eq.nome}`,
        mensagem: `O equipamento "${eq.nome}" (${eq.marca} ${eq.modelo}) está com status "${eq.status}".`,
        link: `/equipamentos`,
        criadoEm: agora,
      });
    }

    const prioridade = { danger: 0, warning: 1, info: 2 };
    alertas.sort((a, b) => prioridade[a.tipo] - prioridade[b.tipo]);

    return alertas;
  }

  async resumoAlertas() {
    const alertas = await this.listarAlertas();
    return {
      total: alertas.length,
      danger: alertas.filter(a => a.tipo === 'danger').length,
      warning: alertas.filter(a => a.tipo === 'warning').length,
      info: alertas.filter(a => a.tipo === 'info').length,
    };
  }

}
