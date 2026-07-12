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
    private funcionarioRepository: Repository<Funcionario>,

    @InjectRepository(Fornecedor)
    private fornecedorRepository: Repository<Fornecedor>,

    @InjectRepository(Material)
    private materialRepository: Repository<Material>,

    @InjectRepository(Equipamento)
    private equipamentoRepository: Repository<Equipamento>,

    @InjectRepository(Custo)
    private custoRepository: Repository<Custo>,
  ) {}

  async resumo() {
    // Todos os counts em paralelo — nenhuma linha de dados trafega, só um número
    const [obras, funcionarios, fornecedores, materiais, equipamentos] =
      await Promise.all([
        this.obraRepository.count(),
        this.funcionarioRepository.count(),
        this.fornecedorRepository.count(),
        this.materialRepository.count(),
        this.equipamentoRepository.count(),
      ]);

    // Antes: find() trazia todas as colunas de todos os custos para somar em JS.
    // Agora: SUM condicional direto no banco — zero linhas trafegam.
    const financeiro = await this.custoRepository
      .createQueryBuilder('custo')
      .select([
        `COALESCE(SUM(CASE WHEN custo.tipo = 'Entrada' THEN custo.valor ELSE 0 END), 0)`,
        'receitas',
        `COALESCE(SUM(CASE WHEN custo.tipo != 'Entrada' THEN custo.valor ELSE 0 END), 0)`,
        'despesas',
      ])
      .getRawOne<{ receitas: string; despesas: string }>();

    const receitas = Number(financeiro?.receitas ?? 0);
    const despesas = Number(financeiro?.despesas ?? 0);

    return {
      obras,
      funcionarios,
      fornecedores,
      materiais,
      equipamentos,
      receitas,
      despesas,
      lucro: receitas - despesas,
    };
  }

  async dashboardFinanceiro() {
    // Antes: find() completo + reduce em JS.
    // Agora: GROUP BY no banco — só os totais por categoria trafegam.
    const rows = await this.custoRepository
      .createQueryBuilder('custo')
      .select('custo.categoria', 'categoria')
      .addSelect('SUM(custo.valor)', 'total')
      .groupBy('custo.categoria')
      .getRawMany<{ categoria: string; total: string }>();

    const custosPorCategoria: Record<string, number> = {};
    let totalCustos = 0;

    for (const row of rows) {
      const valor = Number(row.total);
      custosPorCategoria[row.categoria] = valor;
      totalCustos += valor;
    }

    return { totalCustos, custosPorCategoria };
  }

  async custosPorObra() {
    // Antes: find({ relations: ['obra'] }) — trazia todas as linhas + join completo com Obra.
    // Agora: GROUP BY no banco com join controlado, só as colunas necessárias.
    const rows = await this.custoRepository
      .createQueryBuilder('custo')
      .leftJoin('custo.obra', 'obra')
      .select('obra.nome', 'nomeObra')
      .addSelect(`SUM(CASE WHEN custo.tipo = 'Entrada' THEN custo.valor ELSE 0 END)`, 'entradas')
      .addSelect(`SUM(CASE WHEN custo.tipo != 'Entrada' THEN custo.valor ELSE 0 END)`, 'saidas')
      .addSelect('SUM(custo.valor)', 'total')
      .groupBy('obra.nome')
      .getRawMany<{ nomeObra: string; entradas: string; saidas: string; total: string }>();

    const obras    = rows.map(r => r.nomeObra ?? 'Sem Obra');
    const entradas = rows.map(r => Number(r.entradas));
    const saidas   = rows.map(r => Number(r.saidas));
    const totais   = rows.map(r => Number(r.total));

    return { obras, entradas, saidas, totais };
  }

  async evm() {
    // Antes: dois find() completos (obras + custos) com todos os campos.
    // Agora: select apenas das colunas usadas no cálculo EVM.
    const [obras, custos] = await Promise.all([
      this.obraRepository
        .createQueryBuilder('obra')
        .select([
          'obra.id',
          'obra.dataInicio',
          'obra.dataPrevista',
          'obra.orcamento',
          'obra.status',
        ])
        .getMany(),

      this.custoRepository
        .createQueryBuilder('custo')
        .select(['custo.obraId', 'custo.data', 'custo.valor'])
        .getMany(),
    ]);

    const toDate = (s: string | null | undefined): Date | null => {
      if (!s) return null;
      const str = String(s).trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [d, m, y] = str.split('/');
        const dt = new Date(Number(y), Number(m) - 1, Number(d));
        return isNaN(dt.getTime()) ? null : dt;
      }
      if (/^\d{4}-\d{2}(-\d{2})?$/.test(str)) {
        const parts = str.split('-');
        const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, parts[2] ? Number(parts[2]) : 1);
        return isNaN(dt.getTime()) ? null : dt;
      }
      const dt = new Date(str);
      return isNaN(dt.getTime()) ? null : dt;
    };

    const toMesKey = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    const obrasDates  = obras.map(o => toDate(o.dataInicio)).filter((d): d is Date => d !== null);
    const custosDates = custos.map(c => toDate(c.data)).filter((d): d is Date => d !== null);
    const allDates    = [...obrasDates, ...custosDates];

    if (allDates.length === 0) return { meses: [], pv: [], ac: [], ev: [] };

    const minMs = Math.min(...allDates.map(d => d.getTime()));
    const maxMs = Math.max(...allDates.map(d => d.getTime()));

    const startDate = new Date(minMs);
    startDate.setDate(1);
    const endDate = new Date(maxMs);
    endDate.setDate(1);

    const meses: string[] = [];
    const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    while (cur <= end) {
      meses.push(toMesKey(cur));
      cur.setMonth(cur.getMonth() + 1);
    }
    if (meses.length < 2) {
      meses.push(toMesKey(new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)));
    }

    const pvPorMes: Record<string, number> = {};
    meses.forEach(m => { pvPorMes[m] = 0; });

    for (const obra of obras) {
      const inicio = toDate(obra.dataInicio);
      if (!inicio) continue;
      let fim = toDate(obra.dataPrevista);
      if (!fim) fim = new Date(inicio.getFullYear(), inicio.getMonth() + 6, 1);
      const orcamento = Number(obra.orcamento);
      if (!orcamento) continue;
      const obraStart  = toMesKey(inicio);
      const obraEnd    = toMesKey(fim);
      const mesesObra  = meses.filter(m => m >= obraStart && m <= obraEnd);
      if (mesesObra.length === 0) {
        if (pvPorMes[meses[0]] !== undefined) pvPorMes[meses[0]] += orcamento;
        continue;
      }
      const pvPorMesObra = orcamento / mesesObra.length;
      mesesObra.forEach(m => { pvPorMes[m] += pvPorMesObra; });
    }

    const acPorMes: Record<string, number> = {};
    meses.forEach(m => { acPorMes[m] = 0; });
    for (const custo of custos) {
      const d = toDate(custo.data);
      if (!d) continue;
      const mesKey = toMesKey(d);
      if (acPorMes[mesKey] !== undefined) {
        acPorMes[mesKey] += Number(custo.valor);
      } else if (mesKey < meses[0]) {
        acPorMes[meses[0]] += Number(custo.valor);
      } else {
        acPorMes[meses[meses.length - 1]] += Number(custo.valor);
      }
    }

    const evPorMes: Record<string, number> = {};
    meses.forEach(m => { evPorMes[m] = 0; });

    const custosPorObraMap: Record<number, number> = {};
    for (const custo of custos) {
      custosPorObraMap[custo.obraId] = (custosPorObraMap[custo.obraId] || 0) + Number(custo.valor);
    }

    for (const obra of obras) {
      const orcamento = Number(obra.orcamento);
      if (!orcamento) continue;
      const custoObra   = custosPorObraMap[obra.id] || 0;
      const isConcluida = obra.status === 'Concluída' || obra.status === 'Concluido';

      if (isConcluida) {
        const fim    = toDate(obra.dataPrevista);
        const mesKey = fim ? toMesKey(fim) : meses[meses.length - 1];
        const target = evPorMes[mesKey] !== undefined ? mesKey : meses[meses.length - 1];
        evPorMes[target] += orcamento;
      } else {
        const ratio   = Math.min(custoObra / orcamento, 1);
        const evTotal = orcamento * ratio;
        if (evTotal === 0) continue;
        const inicio         = toDate(obra.dataInicio);
        const obraStart      = inicio ? toMesKey(inicio) : meses[0];
        const mesesComCusto  = meses.filter(m => m >= obraStart && acPorMes[m] > 0);
        if (mesesComCusto.length === 0) {
          evPorMes[meses[0]] += evTotal;
        } else {
          const evPorMesObra = evTotal / mesesComCusto.length;
          mesesComCusto.forEach(m => { evPorMes[m] += evPorMesObra; });
        }
      }
    }

    let pvAcc = 0, acAcc = 0, evAcc = 0;
    const pvArr: number[] = [];
    const acArr: number[] = [];
    const evArr: number[] = [];
    for (const m of meses) {
      pvAcc += pvPorMes[m] || 0;
      acAcc += acPorMes[m] || 0;
      evAcc += evPorMes[m] || 0;
      pvArr.push(Math.round(pvAcc));
      acArr.push(Math.round(acAcc));
      evArr.push(Math.round(evAcc));
    }

    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const labels = meses.map(m => {
      const [ano, mes] = m.split('-');
      return `${mesesNomes[Number(mes) - 1]}/${ano.slice(2)}`;
    });

    return { meses: labels, pv: pvArr, ac: acArr, ev: evArr };
  }
}
