import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObraService } from '../../../core/services/obra.service';
import { Obra } from '../../../models/obra';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  obras: Obra[] = [];

  constructor(
    private obraService: ObraService
  ) {}

  ngOnInit(): void {

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

  get totalObras() {

    return this.obras.length;

  }

  get obrasPlanejamento() {

    return this.obras
      .filter(
        o => o.status === 'Planejamento'
      )
      .length;

  }

  get obrasConcluidas() {

    return this.obras
      .filter(
        o => o.status === 'Concluída'
      )
      .length;

  }

  get obrasAndamento() {

    return this.obras
      .filter(
        o => o.status === 'Em andamento'
      )
      .length;

  }

  get orcamentoTotal() {

    return this.obras.reduce(
      (total, obra) =>
        total + Number(obra.orcamento),
      0
    );

  }

}