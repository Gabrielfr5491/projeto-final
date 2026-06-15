import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { EquipamentoService } from '../../../core/services/equipamento.service';
import { Equipamento } from '../../../models/equipamento';

@Component({
  selector: 'app-lista-equipamentos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './lista-equipamentos.component.html',
  styleUrl: './lista-equipamentos.component.scss'
})
export class ListaEquipamentosComponent implements OnInit {

  equipamentos: Equipamento[] = [];

  constructor(
    private equipamentoService: EquipamentoService
  ) {}

  ngOnInit(): void {
    this.carregarEquipamentos();
  }

  carregarEquipamentos() {

    this.equipamentoService
      .listar()
      .subscribe({
        next: (dados) => {
          this.equipamentos = dados;
        }
      });

  }

  excluir(id: number | undefined) {

    if (!id) return;

    if (!confirm(
      'Deseja excluir este equipamento?'
    )) {
      return;
    }

    this.equipamentoService
      .excluir(id)
      .subscribe(() => {

        this.carregarEquipamentos();

      });

  }

}