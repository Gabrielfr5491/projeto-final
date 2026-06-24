import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FuncionarioService } from '../../../core/services/funcionario.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

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
    private router: Router,
    private toast: ToastService
  ) {}

  salvar() {

    this.funcionarioService
      .adicionar(this.funcionario)
      .subscribe({

        next: () => {
          this.toast.sucesso('Funcionário cadastrado com sucesso!');
          this.router.navigate(['/funcionarios']);
        },

        error: (erro) => {

          console.error(erro);

          this.toast.erro('Erro ao cadastrar funcionário.');

        }

      });

  }
  cancelar() {

  this.router.navigate([
    '/funcionarios'
  ]);

}

}