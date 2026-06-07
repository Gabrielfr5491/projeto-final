import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObraService } from '../../../core/services/obra.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    public obraService: ObraService
  ) {}

  get totalObras() {
    return this.obraService.listar().length;
  }

  get obrasPlanejamento() {
    return this.obraService
      .listar()
      .filter(o => o.status === 'Planejamento')
      .length;
  }

  get obrasConcluidas() {
    return this.obraService
      .listar()
      .filter(o => o.status === 'Concluída')
      .length;
  }

  get obrasAndamento() {
    return this.totalObras -
      this.obrasPlanejamento -
      this.obrasConcluidas;
  }

  get orcamentoTotal() {
    return this.obraService
      .listar()
      .reduce(
        (total, obra) =>
          total + obra.orcamento,
        0
      );
  }
}