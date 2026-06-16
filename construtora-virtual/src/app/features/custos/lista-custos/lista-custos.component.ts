import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CustoService } from '../../../core/services/custo.service';
import { Custo } from '../../../models/custo';

@Component({
  selector: 'app-lista-custos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './lista-custos.component.html',
  styleUrl: './lista-custos.component.scss'
})
export class ListaCustosComponent
implements OnInit {

  custos: Custo[] = [];

  constructor(
    private custoService: CustoService
  ) {}

  ngOnInit(): void {
    this.carregarCustos();
  }

  carregarCustos() {

    this.custoService
      .listar()
      .subscribe({
        next: (dados) => {
          this.custos = dados;
        }
      });

  }

  excluir(id: number | undefined) {

    if (!id) return;

    if (!confirm(
      'Deseja excluir este custo?'
    )) {
      return;
    }

    this.custoService
      .excluir(id)
      .subscribe(() => {

        this.carregarCustos();

      });

  }

}