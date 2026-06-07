import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ObraService }
from '../../../core/services/obra.service';

@Component({
  selector: 'app-lista-obras',
  standalone: true,
  imports: [CommonModule],
  templateUrl:
  './lista-obras.component.html'
})
export class ListaObrasComponent {
  filtro = '';
  
  constructor(
    public obraService:
    ObraService
  ) {}

  excluir(id: number) {
    this.obraService.excluir(id);
  }

  get obrasFiltradas() {

  return this.obraService
    .listar()
    .filter(
      obra =>
      obra.nome
      .toLowerCase()
      .includes(
        this.filtro
        .toLowerCase()
      )
    );
}
}