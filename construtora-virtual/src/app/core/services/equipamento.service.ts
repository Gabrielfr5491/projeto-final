
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Equipamento } from '../../models/equipamento';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {

  private api =
    'https://projeto-final-3-7epi.onrender.com';

  constructor(
    private http: HttpClient
  ) {}

  listar() {
    return this.http.get<Equipamento[]>(
      `${this.api}/equipamentos`
    );
  }

  buscarPorId(id: number) {
    return this.http.get<Equipamento>(
      `${this.api}/equipamentos/${id}`
    );
  }

  adicionar(equipamento: Equipamento) {
    return this.http.post(
      `${this.api}/equipamentos`,
      equipamento
    );
  }

  atualizar(
    id: number,
    equipamento: Equipamento
  ) {
    return this.http.patch(
      `${this.api}/equipamentos/${id}`,
      equipamento
    );
  }

  excluir(id: number) {
    return this.http.delete(
      `${this.api}/equipamentos/${id}`
    );
  }

}