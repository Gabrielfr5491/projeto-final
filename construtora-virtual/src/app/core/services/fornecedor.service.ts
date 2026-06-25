import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  private api =
    'https://projeto-final-3-7epi.onrender.com';

  constructor(
    private http: HttpClient
  ) {}

  listar() {
    return this.http.get<any[]>(
      this.api
    );
  }

  buscarPorId(id: number) {
    return this.http.get<any>(
      `${this.api}/${id}`
    );
  }

  adicionar(fornecedor: any) {
    return this.http.post(
      this.api,
      fornecedor
    );
  }

  atualizar(
    id: number,
    fornecedor: any
  ) {
    return this.http.patch(
      `${this.api}/${id}`,
      fornecedor
    );
  }

  excluir(id: number) {
    return this.http.delete(
      `${this.api}/${id}`
    );
  }
}