import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  RelatoriosService,
  RelatorioFinanceiro,
  RelatorioFuncionarios,
  RelatorioMateriais,
  RelatorioEquipamentos,
  RelatorioObra,
} from '../../core/services/relatorios.service';

type Aba = 'financeiro' | 'obras' | 'funcionarios' | 'materiais' | 'equipamentos';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss',
})
export class RelatoriosComponent implements OnInit {

  abaAtiva: Aba = 'financeiro';

  carregando = false;

  // Dados por aba
  financeiro: RelatorioFinanceiro | null = null;
  obras: RelatorioObra[] = [];
  funcionarios: RelatorioFuncionarios | null = null;
  materiais: RelatorioMateriais | null = null;
  equipamentos: RelatorioEquipamentos | null = null;

  // Filtros
  buscaFinanceiro = '';
  buscaObras = '';
  buscaFuncionarios = '';
  buscaMateriais = '';
  filtroMaterialCritico = false;

  // Controle de carregamento por aba
  private carregadas = new Set<Aba>();

  constructor(private relatoriosService: RelatoriosService) {}

  ngOnInit(): void {
    this.carregarAba('financeiro');
  }

  mudarAba(aba: Aba) {
    this.abaAtiva = aba;
    if (!this.carregadas.has(aba)) {
      this.carregarAba(aba);
    }
  }

  private carregarAba(aba: Aba) {
    this.carregando = true;

    const obs$ = {
      financeiro: () =>
        this.relatoriosService.financeiro().subscribe({
          next: d => { this.financeiro = d; this.fim(aba); },
          error: () => this.fim(aba),
        }),
      obras: () =>
        this.relatoriosService.obras().subscribe({
          next: d => { this.obras = d; this.fim(aba); },
          error: () => this.fim(aba),
        }),
      funcionarios: () =>
        this.relatoriosService.funcionarios().subscribe({
          next: d => { this.funcionarios = d; this.fim(aba); },
          error: () => this.fim(aba),
        }),
      materiais: () =>
        this.relatoriosService.materiais().subscribe({
          next: d => { this.materiais = d; this.fim(aba); },
          error: () => this.fim(aba),
        }),
      equipamentos: () =>
        this.relatoriosService.equipamentos().subscribe({
          next: d => { this.equipamentos = d; this.fim(aba); },
          error: () => this.fim(aba),
        }),
    };

    obs$[aba]();
  }

  private fim(aba: Aba) {
    this.carregando = false;
    this.carregadas.add(aba);
  }

  // ── Getters de filtragem ──────────────────────────────────────────────────

  get itensFinanceiroFiltrados() {
    if (!this.financeiro) return [];
    const b = this.buscaFinanceiro.toLowerCase();
    return this.financeiro.itens.filter(
      i =>
        !b ||
        i.descricao.toLowerCase().includes(b) ||
        i.obra.toLowerCase().includes(b) ||
        i.categoria.toLowerCase().includes(b),
    );
  }

  get obrasFiltradas() {
    const b = this.buscaObras.toLowerCase();
    return this.obras.filter(
      o =>
        !b ||
        o.nome.toLowerCase().includes(b) ||
        o.cidade.toLowerCase().includes(b) ||
        o.estado.toLowerCase().includes(b),
    );
  }

  get funcionariosFiltrados() {
    if (!this.funcionarios) return [];
    const b = this.buscaFuncionarios.toLowerCase();
    return this.funcionarios.lista.filter(
      f =>
        !b ||
        f.nome.toLowerCase().includes(b) ||
        f.cargo.toLowerCase().includes(b),
    );
  }

  get materiaisFiltrados() {
    if (!this.materiais) return [];
    const b = this.buscaMateriais.toLowerCase();
    return this.materiais.lista.filter(m => {
      const matchBusca =
        !b ||
        m.nome.toLowerCase().includes(b) ||
        m.categoria.toLowerCase().includes(b);
      const matchCritico = !this.filtroMaterialCritico || m.critico;
      return matchBusca && matchCritico;
    });
  }

  // ── Exportação CSV ────────────────────────────────────────────────────────

  exportarCSV() {
    let rows: string[][] = [];
    let nome = '';

    if (this.abaAtiva === 'financeiro' && this.financeiro) {
      nome = 'relatorio-financeiro';
      rows = [
        ['Descrição', 'Categoria', 'Obra', 'Data', 'Tipo', 'Valor'],
        ...this.itensFinanceiroFiltrados.map(i => [
          i.descricao,
          i.categoria,
          i.obra,
          this.formatarData(i.data),
          i.tipo,
          this.formatarValor(i.valor),
        ]),
      ];
    } else if (this.abaAtiva === 'obras') {
      nome = 'relatorio-obras';
      rows = [
        ['Nome', 'Cidade', 'Estado', 'Status', 'Orçamento', 'Custo Real', 'Variação %', 'Dias Restantes'],
        ...this.obrasFiltradas.map(o => [
          o.nome,
          o.cidade,
          o.estado,
          o.status,
          this.formatarValor(o.orcamento),
          this.formatarValor(o.custoReal),
          `${o.variacao}%`,
          o.diasRestantes !== null ? String(o.diasRestantes) : '—',
        ]),
      ];
    } else if (this.abaAtiva === 'funcionarios' && this.funcionarios) {
      nome = 'relatorio-funcionarios';
      rows = [
        ['Nome', 'Cargo', 'Salário', 'Status', 'Email', 'Telefone'],
        ...this.funcionariosFiltrados.map(f => [
          f.nome,
          f.cargo,
          this.formatarValor(f.salario),
          f.status,
          f.email,
          f.telefone,
        ]),
      ];
    } else if (this.abaAtiva === 'materiais' && this.materiais) {
      nome = 'relatorio-materiais';
      rows = [
        ['Nome', 'Categoria', 'Unidade', 'Quantidade', 'Estoque Mínimo', 'Vlr Unitário', 'Vlr Total', 'Fornecedor', 'Crítico'],
        ...this.materiaisFiltrados.map(m => [
          m.nome,
          m.categoria,
          m.unidade,
          String(m.quantidade),
          String(m.estoqueMinimo),
          this.formatarValor(m.valorUnitario),
          this.formatarValor(m.valorTotal),
          m.fornecedor,
          m.critico ? 'Sim' : 'Não',
        ]),
      ];
    } else if (this.abaAtiva === 'equipamentos' && this.equipamentos) {
      nome = 'relatorio-equipamentos';
      rows = [
        ['Nome', 'Tipo', 'Marca', 'Modelo', 'Placa', 'Status', 'Valor/Hora'],
        ...this.equipamentos.lista.map(e => [
          e.nome,
          e.tipo,
          e.marca,
          e.modelo,
          e.placa,
          e.status,
          this.formatarValor(e.valorHora),
        ]),
      ];
    }

    if (!rows.length) return;

    const csv =
      '\uFEFF' + // BOM para UTF-8 no Excel
      rows
        .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';'))
        .join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nome}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  formatarValor(v: number): string {
    return Number(v).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatarData(data: string): string {
    if (!data) return '—';
    const parts = data.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return data;
  }

  formatarMes(mes: string): string {
    if (!mes) return '—';
    const nomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const [ano, m] = mes.split('-');
    return `${nomes[Number(m) - 1]}/${ano.slice(2)}`;
  }

  categoriasObj(obj: Record<string, any>): { chave: string; valor: any }[] {
    return Object.entries(obj).map(([chave, valor]) => ({ chave, valor }));
  }

  variancaoClass(v: number): string {
    if (v > 10) return 'badge--danger';
    if (v > 0) return 'badge--warning';
    return 'badge--success';
  }

  get nomesCriticos(): string {
    if (!this.materiais) return '';
    return this.materiais.criticos.map(c => c.nome).join(', ');
  }

  statusContemManutencao(status: string | undefined): boolean {
    return !!status?.toLowerCase().includes('manuten');
  }

  get totalObrasEstouradas(): number {
    return this.obras.filter(o => o.estourado).length;
  }

  get totalObrasConcluidas(): number {
    return this.obras.filter(
      o => o.status === 'Concluída' || o.status === 'Concluido',
    ).length;
  }

}
