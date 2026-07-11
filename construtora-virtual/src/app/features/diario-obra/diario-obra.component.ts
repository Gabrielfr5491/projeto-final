import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ObraService } from '../../core/services/obra.service';
import { DiarioObraService } from '../../core/services/diario-obra.service';
import { AuthService } from '../../core/services/auth.service';

import { Obra } from '../../models/obra';
import { DiarioEntrada } from '../../models/diario-obra';

@Component({
  selector: 'app-diario-obra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diario-obra.component.html',
  styleUrl: './diario-obra.component.scss'
})
export class DiarioObraComponent implements OnInit {

  obras: Obra[] = [];
  entradas: DiarioEntrada[] = [];

  obraIdSelecionada: number | null = null;
  obraSelecionada: Obra | null = null;

  carregandoObras = false;
  carregandoEntradas = false;
  salvando = false;

  mostrarForm = false;
  formEntrada: Partial<DiarioEntrada> = {};
  formErro = '';

  entradaEditandoId: number | null = null;
  formEdicao: Partial<DiarioEntrada> = {};

  constructor(
    private obraService: ObraService,
    private diarioService: DiarioObraService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarObras();
  }

  carregarObras() {
    this.carregandoObras = true;
    this.obraService.listar().subscribe({
      next: (dados) => {
        this.obras = dados;
        this.carregandoObras = false;
      },
      error: () => { this.carregandoObras = false; }
    });
  }

  selecionarObra(id: number) {
    this.obraIdSelecionada = id;
    this.obraSelecionada = this.obras.find(o => o.id === id) ?? null;
    this.entradas = [];
    this.mostrarForm = false;
    this.entradaEditandoId = null;
    this.carregarEntradas();
  }

  carregarEntradas() {
    if (!this.obraIdSelecionada) return;
    this.carregandoEntradas = true;
    this.diarioService.listarPorObra(this.obraIdSelecionada).subscribe({
      next: (dados) => {
        this.entradas = dados;
        this.carregandoEntradas = false;
      },
      error: () => { this.carregandoEntradas = false; }
    });
  }

  abrirForm() {
    const usuario = this.authService.getUsuario();
    this.formEntrada = {
      obraId: this.obraIdSelecionada!,
      data: new Date().toISOString().split('T')[0],
      autor: usuario?.nome ?? ''
    };
    this.formErro = '';
    this.mostrarForm = true;
    this.entradaEditandoId = null;
  }

  cancelarForm() {
    this.mostrarForm = false;
    this.formEntrada = {};
    this.formErro = '';
  }

  salvar() {
    if (!this.formEntrada.titulo?.trim()) {
      this.formErro = 'O título é obrigatório.';
      return;
    }
    if (!this.formEntrada.descricao?.trim()) {
      this.formErro = 'A descrição é obrigatória.';
      return;
    }
    if (!this.formEntrada.data) {
      this.formErro = 'A data é obrigatória.';
      return;
    }

    this.salvando = true;
    this.formErro = '';

    const payload: DiarioEntrada = {
      obraId: this.obraIdSelecionada!,
      titulo: this.formEntrada.titulo!.trim(),
      descricao: this.formEntrada.descricao!.trim(),
      data: this.formEntrada.data!,
      autor: this.formEntrada.autor?.trim() ?? ''
    };

    this.diarioService.adicionar(payload).subscribe({
      next: () => {
        this.salvando = false;
        this.mostrarForm = false;
        this.formEntrada = {};
        this.carregarEntradas();
      },
      error: () => {
        this.salvando = false;
        this.formErro = 'Erro ao salvar entrada. Tente novamente.';
      }
    });
  }

  iniciarEdicao(entrada: DiarioEntrada) {
    this.entradaEditandoId = entrada.id!;
    this.formEdicao = { ...entrada };
    this.mostrarForm = false;
  }

  cancelarEdicao() {
    this.entradaEditandoId = null;
    this.formEdicao = {};
  }

  salvarEdicao() {
    if (!this.formEdicao.titulo?.trim() || !this.formEdicao.descricao?.trim()) return;
    this.salvando = true;
    this.diarioService.atualizar(this.formEdicao as DiarioEntrada).subscribe({
      next: () => {
        this.salvando = false;
        this.entradaEditandoId = null;
        this.formEdicao = {};
        this.carregarEntradas();
      },
      error: () => { this.salvando = false; }
    });
  }

  excluir(id: number | undefined) {
    if (!id) return;
    if (!confirm('Deseja excluir esta entrada do diário?')) return;
    this.diarioService.excluir(id).subscribe(() => this.carregarEntradas());
  }

  formatarData(data: string): string {
    if (!data) return '—';
    const parts = data.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return data;
  }

  voltarParaObras() {
    this.obraIdSelecionada = null;
    this.obraSelecionada = null;
    this.entradas = [];
    this.mostrarForm = false;
    this.entradaEditandoId = null;
  }
}
