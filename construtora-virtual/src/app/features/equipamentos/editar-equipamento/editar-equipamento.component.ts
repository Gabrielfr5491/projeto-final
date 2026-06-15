import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { EquipamentoService } from '../../../core/services/equipamento.service';

@Component({
  selector: 'app-editar-equipamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-equipamento.component.html',
  styleUrl: './editar-equipamento.component.scss'
})
export class EditarEquipamentoComponent
implements OnInit {

  id!: number;

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
    private route: ActivatedRoute,
    private router: Router,
    private equipamentoService:
    EquipamentoService
  ) {}

  ngOnInit(): void {

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.carregarEquipamento();

  }

  carregarEquipamento() {

    this.equipamentoService
      .buscarPorId(this.id)
      .subscribe({

        next: (dados) => {

          this.equipamento = dados;

        },

        error: (erro) => {

          console.error(erro);

        }

      });

  }

  atualizar() {

    this.equipamentoService
      .atualizar(
        this.id,
        this.equipamento
      )
      .subscribe({

        next: () => {

          alert(
            'Equipamento atualizado com sucesso!'
          );

          this.router.navigate([
            '/equipamentos'
          ]);

        },

        error: (erro) => {

          console.error(erro);

          alert(
            'Erro ao atualizar equipamento'
          );

        }

      });

  }

}