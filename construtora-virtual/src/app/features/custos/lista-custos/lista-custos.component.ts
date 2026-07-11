import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CustoService } from '../../../core/services/custo.service';
import { AuthService } from '../../../core/services/auth.service';
import { Custo } from '../../../models/custo';

@Component({
  selector: 'app-lista-custos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-custos.component.html',
  styleUrl: './lista-custos.component.scss'
})
export class ListaCustosComponent implements OnInit {

  custos: Custo[] = [];
  filtroTipo: string = '';
  filtroCategoria: string = '';
  busca: string = '';

  constructor(private custoService: CustoService, public auth: AuthService) {}

  ngOnInit(): void {
    this.carregarCustos();
  }

  carregarCustos() {
    this.custoService.listar().subscribe({
      next: (dados) => { this.custos = dados; }
    });
  }

  excluir(id: number | undefined) {
    if (!id) return;
    if (!confirm('Deseja excluir este custo?')) return;
    this.custoService.excluir(id).subscribe(() => this.carregarCustos());
  }

  get custosFiltrados(): Custo[] {
    return this.custos.filter(c => {
      const matchTipo      = !this.filtroTipo      || c.tipo === this.filtroTipo;
      const matchCategoria = !this.filtroCategoria || c.categoria === this.filtroCategoria;
      const matchBusca     = !this.busca           ||
        c.descricao.toLowerCase().includes(this.busca.toLowerCase()) ||
        (c.obra?.nome ?? '').toLowerCase().includes(this.busca.toLowerCase());
      return matchTipo && matchCategoria && matchBusca;
    });
  }

  get categorias(): string[] {
    return [...new Set(this.custos.map(c => c.categoria))].sort();
  }

  get totalEntradas(): number {
    return this.custos
      .filter(c => c.tipo === 'Entrada')
      .reduce((s, c) => s + Number(c.valor), 0);
  }

  get totalSaidas(): number {
    return this.custos
      .filter(c => c.tipo === 'Saida')
      .reduce((s, c) => s + Number(c.valor), 0);
  }

  get saldo(): number {
    return this.totalEntradas - this.totalSaidas;
  }

  get totalGeral(): number {
    return this.custos.reduce((s, c) => s + Number(c.valor), 0);
  }

  formatarValor(v: number): string {
    return Number(v).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatarData(data: string): string {
    if (!data) return '—';
    const parts = data.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return data;
  }

  limparFiltros() {
    this.filtroTipo = '';
    this.filtroCategoria = '';
    this.busca = '';
  }
}
