import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ObraService } from '../../../core/services/obra.service';
import { Obra } from '../../../models/obra';

@Component({
  selector: 'app-lista-obras',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lista-obras.component.html'
})
export class ListaObrasComponent
implements OnInit {

  filtro = '';

  obras: Obra[] = [];

  constructor(
    private obraService: ObraService
  ) {}

  ngOnInit() {

    this.carregarObras();

  }

  carregarObras() {

    this.obraService
      .listar()
      .subscribe({

        next: (dados) => {

          this.obras = dados;

        },

        error: (erro) => {

          console.error(
            'Erro ao carregar obras',
            erro
          );

        }

      });

  }

  excluir(id: number) {

    this.obraService
      .excluir(id)
      .subscribe({

        next: () => {

          this.carregarObras();

        }

      });

  }

  get obrasFiltradas() {

    return this.obras.filter(
      obra =>
        obra.nome
          .toLowerCase()
          .includes(
            this.filtro.toLowerCase()
          )
    );

  }

}