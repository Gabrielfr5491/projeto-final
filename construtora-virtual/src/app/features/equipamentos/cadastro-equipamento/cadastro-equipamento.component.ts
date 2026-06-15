import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { EquipamentoService } from '../../../core/services/equipamento.service';

@Component({
  selector: 'app-cadastro-equipamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cadastro-equipamento.component.html',
  styleUrl: './cadastro-equipamento.component.scss'
})
export class CadastroEquipamentoComponent {

  equipamento = {

    nome: '',

    tipo: '',

    marca: '',

    modelo: '',

    placa: '',

    status: '',

    valorHora: 0

  };

  constructor(
    private equipamentoService: EquipamentoService,
    private router: Router
  ) {}

  salvar() {

    this.equipamentoService
      .adicionar(this.equipamento)
      .subscribe({

        next: () => {

          alert(
            'Equipamento cadastrado com sucesso!'
          );

          this.router.navigate([
            '/equipamentos'
          ]);

        },

        error: (erro) => {

          console.error(erro);

          alert(
            'Erro ao cadastrar equipamento'
          );

        }

      });

  }

}