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

    // Antes: find() em obras trazia modelo3dBase64, mapaEletricistaBase64 e pdfClausulasBase64.
    // Agora: select explícito com apenas as colunas usadas na lógica de alertas.
    //
    // Antes: find({ relations: ['obra'] }) em custos carregava eager + relations duplicando base64.
    // Agora: QueryBuilder com SUM agrupado por obraId — zero linhas de custo trafegam.
    const [obras, custosPorObra, materiais, equipamentos] = await Promise.all([
      this.obraRepository
        .createQueryBuilder('obra')
        .select([
          'obra.id',
          'obra.nome',
          'obra.cidade',
          'obra.estado',
          'obra.status',
          'obra.dataInicio',
          'obra.dataPrevista',
          'obra.orcamento',
        ])
        .getMany(),

      // SUM apenas de saídas (tipo != 'Entrada') — receitas não consomem orçamento
      this.custoRepository
        .createQueryBuilder('custo')
        .select('custo.obraId', 'obraId')
        .addSelect(`SUM(CASE WHEN custo.tipo != 'Entrada' THEN custo.valor ELSE 0 END)`, 'totalCusto')
        .groupBy('custo.obraId')
        .getRawMany<{ obraId: number; totalCusto: string }>(),

      // Material: só as colunas usadas na comparação de estoque
      this.materialRepository
        .createQueryBuilder('mat')
        .select(['mat.id', 'mat.nome', 'mat.quantidade', 'mat.estoqueMinimo', 'mat.unidade'])
        .getMany(),

      // Equipamento: só as colunas usadas no filtro de status
      this.equipamentoRepository
        .createQueryBuilder('eq')
        .select(['eq.id', 'eq.nome', 'eq.marca', 'eq.modelo', 'eq.status'])
        .getMany(),
    ]);

    // Monta mapa obraId → totalCusto a partir do resultado agregado
    const custosPorObraId: Record<number, number> = {};
    for (const row of custosPorObra) {
      custosPorObraId[Number(row.obraId)] = Number(row.totalCusto);
    }

    // --- Alertas de obras ---
    for (const obra of obras) {
      const isConcluida = obra.status === 'Concluída' || obra.status === 'Concluido';
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

      const custoReal = custosPorObraId[obra.id] ?? 0;
      const orcamento = Number(obra.orcamento);

      if (orcamento > 0 && custoReal > orcamento) {
        const excesso    = custoReal - orcamento;
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

      if (!obra.dataInicio) {
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
    }

    // --- Alertas de materiais ---
    for (const mat of materiais) {
      if (Number(mat.quantidade) <= Number(mat.estoqueMinimo)) {
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
    }

    // --- Alertas de equipamentos ---
    for (const eq of equipamentos) {
      const statusLower = eq.status?.toLowerCase() ?? '';
      if (
        statusLower.includes('manuten') ||
        statusLower === 'inativo' ||
        statusLower === 'inativa'
      ) {
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
    }

    const prioridade = { danger: 0, warning: 1, info: 2 };
    alertas.sort((a, b) => prioridade[a.tipo] - prioridade[b.tipo]);

    return alertas;
  }

  async resumoAlertas() {
    const alertas = await this.listarAlertas();
    return {
      total:   alertas.length,
      danger:  alertas.filter(a => a.tipo === 'danger').length,
      warning: alertas.filter(a => a.tipo === 'warning').length,
      info:    alertas.filter(a => a.tipo === 'info').length,
    };
  }
}
