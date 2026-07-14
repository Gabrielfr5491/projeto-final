import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FornecedorService } from '../../../core/services/fornecedor.service';
import { ToastService } from '../../../core/services/toast.service';
import { Fornecedor } from '../../../models/fornecedor';

@Component({
  selector: 'app-lista-fornecedores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-fornecedores.component.html',
  styleUrl: './lista-fornecedores.component.scss'
})
export class ListaFornecedoresComponent implements OnInit {

  fornecedores: Fornecedor[] = [];
  filtro = '';
  carregando = false;

  constructor(
    private fornecedorService: FornecedorService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.fornecedorService.listar().subscribe({
      next: (dados) => {
        this.fornecedores = dados;
        this.carregando = false;
      },
      error: () => {
        this.toast.erro('Erro ao carregar fornecedores.');
        this.carregando = false;
      }
    });
  }

  get fornecedoresFiltrados(): Fornecedor[] {
    const q = this.filtro.toLowerCase();
    if (!q) return this.fornecedores;
    return this.fornecedores.filter(f =>
      f.nome.toLowerCase().includes(q) ||
      f.cnpj.toLowerCase().includes(q) ||
      f.categoria?.toLowerCase().includes(q) ||
      f.status?.toLowerCase().includes(q)
    );
  }

  excluir(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Tem certeza que deseja remover este fornecedor?')) return;
    this.fornecedorService.excluir(id).subscribe({
      next: () => {
        this.toast.sucesso('Fornecedor removido com sucesso.');
        this.carregar();
      },
      error: () => this.toast.erro('Erro ao remover fornecedor.')
    });
  }
}
