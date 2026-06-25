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
    return this.http.get<Custo[]>(this.api);
  }

  buscarPorId(id: number) {
    return this.http.get<Custo>(
      `${this.api}/${id}`
    );
  }

  adicionar(custo: Custo) {
    return this.http.post(
      this.api,
      custo
    );
  }

  atualizar(
    id: number,
    custo: Custo
  ) {
    return this.http.patch(
      `${this.api}/${id}`,
      custo
    );
  }

  excluir(id: number) {
    return this.http.delete(
      `${this.api}/${id}`
    );
  }

}