import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FuncionarioService } from '../../../core/services/funcionario.service';
import { Funcionario } from '../../../models/funcionario';

@Component({
  selector: 'app-lista-funcionarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-funcionarios.component.html',
  styleUrl: './lista-funcionarios.component.scss'
})
export class ListaFuncionariosComponent implements OnInit {

  funcionarios: Funcionario[] = [];

  constructor(
    private funcionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios() {
    this.funcionarioService
      .listar()
      .subscribe({
        next: (dados) => {
          this.funcionarios = dados;
        },
        error: (erro) => {
          console.error(
            'Erro ao carregar funcionários',
            erro
          );
        }
      });
  }

  // MODIFICADO: Agora aceita 'number | undefined' para bater com o seu Model
 excluir(id: number | string | undefined) {
  
  if (id === undefined) {
    console.error('Não é possível excluir um funcionário sem ID.');
    return;
  }

  if (!confirm('Deseja excluir este funcionário?')) {
    return;
  }

  this.funcionarioService
    .excluir(Number(id))
    .subscribe({
      next: () => {
        // Atualiza a lista na tela após excluir
        this.carregarFuncionarios();
      },
      error: (erro) => {
        console.error('Erro ao excluir funcionário', erro);
      }
    });
}

}