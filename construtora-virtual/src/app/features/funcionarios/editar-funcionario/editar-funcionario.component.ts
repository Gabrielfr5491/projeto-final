import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { FuncionarioService } from '../../../core/services/funcionario.service';

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
    private funcionarioService: FuncionarioService
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

          alert(
            'Funcionário atualizado com sucesso!'
          );

          this.router.navigate([
            '/funcionarios'
          ]);

        },

        error: (erro) => {

          console.error(erro);

          alert(
            'Erro ao atualizar funcionário'
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