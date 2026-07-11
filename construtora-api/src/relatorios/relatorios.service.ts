import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Custo } from '../custos/entities/custo.entity';
import { Obra } from '../obras/entities/obra.entity';
import { Funcionario } from '../funcionarios/entities/funcionario.entity';
import { Material } from '../materiais/entities/materiai.entity';
import { Equipamento } from '../equipamentos/entities/equipamento.entity';

@Injectable()
export class RelatoriosService {

  constructor(
    @InjectRepository(Custo)
    private custoRepository: Repository<Custo>,

    @InjectRepository(Obra)
    private obraRepository: Repository<Obra>,

    @InjectRepository(Funcionario)
    private funcionarioRepository: Repository<Funcionario>,

    @InjectRepository(Material)
    private materialRepository: Repository<Material>,

    @InjectRepository(Equipamento)
    private equipamentoRepository: Repository<Equipamento>,
  ) {}

  async custosPorObra() {
    const custos = await this.custoRepository.find({ relations: ['obra'] });
    const resultado: Record<string, number> = {};
    custos.forEach(custo => {
      const nomeObra = custo.obra?.nome || 'Sem Obra';
      if (!resultado[nomeObra]) resultado[nomeObra] = 0;
      resultado[nomeObra] += Number(custo.valor);
    });
    return resultado;
  }

  async relatorioFinanceiro(obraId?: number) {
    const where = obraId ? { obraId } : {};
    const custos = await this.custoRepository.find({ where, relations: ['obra'] });

    const totalEntradas = custos
      .filter(c => c.tipo === 'Entrada')
      .reduce((acc, c) => acc + Number(c.valor), 0);

    const totalSaidas = custos
      .filter(c => c.tipo !== 'Entrada')
      .reduce((acc, c) => acc + Number(c.valor), 0);

    const porCategoria: Record<string, { entradas: number; saidas: number; total: number }> = {};
    custos.forEach(custo => {
      const cat = custo.categoria || 'Outros';
      if (!porCategoria[cat]) porCategoria[cat] = { entradas: 0, saidas: 0, total: 0 };
      const val = Number(custo.valor);
      if (custo.tipo === 'Entrada') {
        porCategoria[cat].entradas += val;
      } else {
        porCategoria[cat].saidas += val;
      }
      porCategoria[cat].total += val;
    });

    const evolucaoMensal: Record<string, { entradas: number; saidas: number }> = {};
    custos.forEach(custo => {
      if (!custo.data) return;
      const mes = custo.data.substring(0, 7);
      if (!evolucaoMensal[mes]) evolucaoMensal[mes] = { entradas: 0, saidas: 0 };
      if (custo.tipo === 'Entrada') {
        evolucaoMensal[mes].entradas += Number(custo.valor);
      } else {
        evolucaoMensal[mes].saidas += Number(custo.valor);
      }
    });

    const mesesOrdenados = Object.keys(evolucaoMensal).sort();
    const evolucao = mesesOrdenados.map(mes => ({
      mes,
      entradas: evolucaoMensal[mes].entradas,
      saidas: evolucaoMensal[mes].saidas,
      saldo: evolucaoMensal[mes].entradas - evolucaoMensal[mes].saidas,
    }));

    return {
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas,
      porCategoria,
      evolucao,
      itens: custos.map(c => ({
        id: c.id,
        descricao: c.descricao,
        categoria: c.categoria,
        tipo: c.tipo,
        valor: Number(c.valor),
        data: c.data,
        obra: c.obra?.nome ?? 'Sem Obra',
      })),
    };
  }

  async relatorioFuncionarios() {
    const funcionarios = await this.funcionarioRepository.find();
    const totalFolha = funcionarios.reduce((acc, f) => acc + Number(f.salario), 0);

    const porcargo: Record<string, { quantidade: number; folha: number }> = {};
    funcionarios.forEach(f => {
      const cargo = f.cargo || 'Outros';
      if (!porcargo[cargo]) porcargo[cargo] = { quantidade: 0, folha: 0 };
      porcargo[cargo].quantidade += 1;
      porcargo[cargo].folha += Number(f.salario);
    });

    const ativos = funcionarios.filter(
      f => f.status?.toLowerCase() === 'ativo' || f.status?.toLowerCase() === 'ativa',
    ).length;

    return {
      total: funcionarios.length,
      ativos,
      inativos: funcionarios.length - ativos,
      totalFolha,
      mediaSalarial: funcionarios.length > 0 ? totalFolha / funcionarios.length : 0,
      porCargo: porcargo,
      lista: funcionarios.map(f => ({
        id: f.id,
        nome: f.nome,
        cargo: f.cargo,
        salario: Number(f.salario),
        status: f.status,
        email: f.email,
        telefone: f.telefone,
      })),
    };
  }

  async relatorioMateriais() {
    const materiais = await this.materialRepository.find();

    const valorTotalEstoque = materiais.reduce(
      (acc, m) => acc + Number(m.valorUnitario) * Number(m.quantidade),
      0,
    );

    const criticos = materiais.filter(
      m => Number(m.quantidade) <= Number(m.estoqueMinimo),
    );

    const porCategoria: Record<string, { quantidade: number; valor: number }> = {};
    materiais.forEach(m => {
      const cat = m.categoria || 'Outros';
      if (!porCategoria[cat]) porCategoria[cat] = { quantidade: 0, valor: 0 };
      porCategoria[cat].quantidade += Number(m.quantidade);
      porCategoria[cat].valor += Number(m.valorUnitario) * Number(m.quantidade);
    });

    return {
      total: materiais.length,
      totalCriticos: criticos.length,
      valorTotalEstoque,
      porCategoria,
      criticos: criticos.map(m => ({
        id: m.id,
        nome: m.nome,
        categoria: m.categoria,
        quantidade: Number(m.quantidade),
        estoqueMinimo: Number(m.estoqueMinimo),
        unidade: m.unidade,
        fornecedor: m.fornecedor,
      })),
      lista: materiais.map(m => ({
        id: m.id,
        nome: m.nome,
        categoria: m.categoria,
        unidade: m.unidade,
        quantidade: Number(m.quantidade),
        estoqueMinimo: Number(m.estoqueMinimo),
        valorUnitario: Number(m.valorUnitario),
        valorTotal: Number(m.valorUnitario) * Number(m.quantidade),
        fornecedor: m.fornecedor,
        critico: Number(m.quantidade) <= Number(m.estoqueMinimo),
      })),
    };
  }

  async relatorioEquipamentos() {
    const equipamentos = await this.equipamentoRepository.find();

    const porStatus: Record<string, number> = {};
    equipamentos.forEach(e => {
      const s = e.status || 'Indefinido';
      porStatus[s] = (porStatus[s] || 0) + 1;
    });

    const porTipo: Record<string, number> = {};
    equipamentos.forEach(e => {
      const t = e.tipo || 'Outros';
      porTipo[t] = (porTipo[t] || 0) + 1;
    });

    return {
      total: equipamentos.length,
      porStatus,
      porTipo,
      lista: equipamentos.map(e => ({
        id: e.id,
        nome: e.nome,
        tipo: e.tipo,
        marca: e.marca,
        modelo: e.modelo,
        placa: e.placa,
        status: e.status,
        valorHora: Number(e.valorHora),
      })),
    };
  }

  async relatorioObras() {
    const obras = await this.obraRepository.find();
    const custos = await this.custoRepository.find({ relations: ['obra'] });

    const custosPorObraId: Record<number, number> = {};
    custos.forEach(c => {
      custosPorObraId[c.obraId] = (custosPorObraId[c.obraId] || 0) + Number(c.valor);
    });

    const hoje = new Date();

    return obras.map(o => {
      const custoReal = custosPorObraId[o.id] || 0;
      const orcamento = Number(o.orcamento);
      const variacao = orcamento > 0 ? ((custoReal - orcamento) / orcamento) * 100 : 0;

      let diasRestantes: number | null = null;
      if (o.dataPrevista) {
        const dataPrev = new Date(o.dataPrevista);
        diasRestantes = Math.ceil((dataPrev.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      }

      return {
        id: o.id,
        nome: o.nome,
        cidade: o.cidade,
        estado: o.estado,
        status: o.status,
        dataInicio: o.dataInicio,
        dataPrevista: o.dataPrevista,
        orcamento,
        custoReal,
        variacao: +variacao.toFixed(1),
        diasRestantes,
        estourado: custoReal > orcamento,
      };
    });
  }

}
