import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Custo } from '../../models/custo';

@Injectable({
  providedIn: 'root'
})
export class CustoService {

  private api =
    'https://projeto-final-3-7epi.onrender.com';

  constructor(
    private http: HttpClient
  ) {}

  listar() {
    return this.http.get<Custo[]>(
      `${this.api}/custos`
    );
  }

  buscarPorId(id: number) {
    return this.http.get<Custo>(
      `${this.api}/custos/${id}`
    );
  }

  adicionar(custo: Custo) {
    return this.http.post(
      `${this.api}/custos`,
      custo
    );
  }

  atualizar(
    id: number,
    custo: Custo
  ) {
    return this.http.patch(
      `${this.api}/custos/${id}`,
      custo
    );
  }

  excluir(id: number) {
    return this.http.delete(
      `${this.api}/custos/${id}`
    );
  }

}