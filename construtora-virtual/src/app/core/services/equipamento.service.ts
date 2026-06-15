// src/app/core/services/equipamento.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Equipamento } from '../../models/equipamento';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {

  private api =
    'http://localhost:3000/equipamentos';

  constructor(
    private http: HttpClient
  ) {}

  listar() {
    return this.http.get<Equipamento[]>(
      this.api
    );
  }

  buscarPorId(id: number) {
    return this.http.get<Equipamento>(
      `${this.api}/${id}`
    );
  }

  adicionar(equipamento: Equipamento) {
    return this.http.post(
      this.api,
      equipamento
    );
  }

  atualizar(
    id: number,
    equipamento: Equipamento
  ) {
    return this.http.patch(
      `${this.api}/${id}`,
      equipamento
    );
  }

  excluir(id: number) {
    return this.http.delete(
      `${this.api}/${id}`
    );
  }

}