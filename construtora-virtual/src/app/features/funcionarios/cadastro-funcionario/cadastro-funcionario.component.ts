import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FuncionarioService } from '../../../core/services/funcionario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-funcionario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cadastro-funcionario.component.html',
  styleUrl: './cadastro-funcionario.component.scss'
})
export class CadastroFuncionarioComponent {

  funcionario = {
    nome: '',
    cpf: '',
    cargo: '',
    salario: 0,
    telefone: '',
    email: '',
    status: ''
  };

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  salvar() {

    this.funcionarioService
      .adicionar(this.funcionario)
      .subscribe({

        next: () => {

          alert(
            'Funcionário cadastrado com sucesso!'
          );

          this.router.navigate([
            '/funcionarios'
          ]);

        },

        error: (erro) => {

          console.error(erro);

          alert(
            'Erro ao cadastrar funcionário'
          );

        }

      });

  }
  cancelar() {

  this.router.navigate([
    '/funcionarios'
  ]);

}

}