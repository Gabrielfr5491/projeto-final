import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import localePt from '@angular/common/locales/pt';

import { ObraService } from '../../../core/services/obra.service';
import { CustoService } from '../../../core/services/custo.service';
import { DiarioObraService } from '../../../core/services/diario-obra.service';

import { Obra } from '../../../models/obra';
import { Custo } from '../../../models/custo';
import { DiarioEntrada } from '../../../models/diario-obra';

registerLocaleData(localePt);

@Component({
  selector: 'app-detalhe-obra',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  templateUrl: './detalhe-obra.component.html',
  styleUrl: './detalhe-obra.component.scss'
})
export class DetalheObraComponent implements OnInit {

  id!: number;
  obra: Obra | null = null;
  custos: Custo[] = [];
  entradas: DiarioEntrada[] = [];

  carregando = true;
  abaAtiva: 'visao-geral' | 'custos' | 'diario' = 'visao-geral';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private obraService: ObraService,
    private custoService: CustoService,
    private diarioService: DiarioObraService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregar();
  }

  carregar(): void {
    this.obraService.buscarPorId(this.id).subscribe({
      next: (obra) => {
        this.obra = obra;
        this.carregando = false;
      },
      error: () => this.router.navigate(['/obras'])
    });

    this.custoService.buscarPorObra(this.id).subscribe({
      next: (dados) => { this.custos = dados; }
    });

    this.diarioService.listarPorObra(this.id).subscribe({
      next: (entradas) => { this.entradas = entradas; }
    });
  }

  get loading(): boolean    { return this.carregando; }
  get custosVinculados()    { return this.custos; }
  get entradasDiario()      { return this.entradas; }

  novaEntradaDiario(): void {
    this.router.navigate(['/diario-obra'], { queryParams: { obraId: this.id } });
  }

  get totalEntradas(): number {
    return this.custos
      .filter(c => c.tipo === 'Entrada')
      .reduce((s, c) => s + Number(c.valor), 0);
  }

  get totalSaidas(): number {
    // Qualquer tipo que não seja 'Entrada' é contado como saída
    return this.custos
      .filter(c => c.tipo !== 'Entrada')
      .reduce((s, c) => s + Number(c.valor), 0);
  }

  get saldo(): number {
    return this.totalEntradas - this.totalSaidas;
  }

  get percentualOrcamento(): number {
    if (!this.obra || !this.obra.orcamento) return 0;
    return Math.min(Math.round((this.totalSaidas / Number(this.obra.orcamento)) * 100), 100);
  }

  get diasRestantes(): number {
    if (!this.obra?.dataPrevista) return 0;
    const hoje = new Date();
    const prevista = new Date(this.obra.dataPrevista);
    return Math.ceil((prevista.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  }

  get duracaoTotal(): number {
    if (!this.obra?.dataInicio || !this.obra?.dataPrevista) return 0;
    const inicio = new Date(this.obra.dataInicio);
    const fim = new Date(this.obra.dataPrevista);
    return Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  }

  get percentualTempo(): number {
    if (!this.obra?.dataInicio || !this.obra?.dataPrevista) return 0;
    const inicio = new Date(this.obra.dataInicio);
    const hoje = new Date();
    const total = this.duracaoTotal;
    if (total <= 0) return 100;
    const passados = Math.ceil((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(Math.max(Math.round((passados / total) * 100), 0), 100);
  }

  formatarData(data: string): string {
    if (!data) return '—';
    const parts = data.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return data;
  }

  formatarValor(v: number): string {
    return Number(v).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'Concluída': 'badge--success',
      'Concluído': 'badge--success',
      'Em andamento': 'badge--info',
      'Em Andamento': 'badge--info',
      'Planejamento': 'badge--warning',
      'Fundação': 'badge--secondary',
      'Estrutura': 'badge--secondary',
      'Acabamento': 'badge--secondary',
    };
    return map[status] ?? 'badge--secondary';
  }

  voltar(): void {
    this.router.navigate(['/obras']);
  }
}
