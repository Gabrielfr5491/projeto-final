import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MaterialService } from '../../../core/services/material.service';
import { AuthService } from '../../../core/services/auth.service';
import { Material } from '../../../models/material';

@Component({
  selector: 'app-lista-materiais',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './lista-materiais.component.html',
  styleUrl: './lista-materiais.component.scss'
})
export class ListaMateriaisComponent implements OnInit {

  materiais: Material[] = [];

  constructor(private materialService: MaterialService, public auth: AuthService) {}

  ngOnInit(): void {
    this.carregarMateriais();
  }

  carregarMateriais() {

    this.materialService
      .listar()
      .subscribe({

        next: (dados) => {
          this.materiais = dados;
        },

        error: (erro) => {
          console.error(
            'Erro ao carregar materiais',
            erro
          );
        }

      });

  }

  excluir(id: number | undefined) {

    if (!id) return;

    if (!confirm('Deseja excluir este material?')) {
      return;
    }

    this.materialService
      .excluir(id)
      .subscribe({

        next: () => {
          this.carregarMateriais();
        },

        error: (erro) => {
          console.error(erro);
        }

      });

  }

}