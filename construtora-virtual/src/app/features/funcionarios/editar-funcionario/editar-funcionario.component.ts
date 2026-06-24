import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { FuncionarioService } from '../../../core/services/funcionario.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-editar-funcionario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-funcionario.component.html',
  styleUrl: './editar-funcionario.component.scss'
})
export class EditarFuncionarioComponent implements OnInit {

  id!: number;

  funcionario: any = {
    nome: '',
    cpf: '',
    cargo: '',
    salario: 0,
    telefone: '',
    email: '',
    status: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private funcionarioService: FuncionarioService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.funcionarioService
      .buscarPorId(this.id)
      .subscribe({

        next: (dados) => {
          this.funcionario = dados;
        },

        error: (erro) => {
          console.error(erro);
        }

      });

  }

  salvar() {

    this.funcionarioService
      .atualizar(
        this.id,
        this.funcionario
      )
      .subscribe({

      next: () => {
        this.toast.sucesso('Funcionário atualizado com sucesso!');
        this.router.navigate(['/funcionarios']);
      },
      error: (erro) => {
        console.error(erro);
        this.toast.erro('Erro ao atualizar funcionário.');
      }

      });

  }

  cancelar() {

    this.router.navigate([
      '/funcionarios'
    ]);

  }

}