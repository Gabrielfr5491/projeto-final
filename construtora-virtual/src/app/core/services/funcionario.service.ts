import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Funcionario } from '../../models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private api =
    'http://localhost:3000/funcionarios';

  constructor(
    private http: HttpClient
  ) {}

  listar(): Observable<Funcionario[]> {

    return this.http.get<Funcionario[]>(
      this.api
    );

  }

  buscarPorId(
    id: number
  ): Observable<Funcionario> {

    return this.http.get<Funcionario>(
      `${this.api}/${id}`
    );

  }

  adicionar(
    funcionario: Funcionario
  ) {

    return this.http.post(
      this.api,
      funcionario
    );

  }

  atualizar(
    id: number,
    funcionario: Funcionario
  ) {

    return this.http.patch(
      `${this.api}/${id}`,
      funcionario
    );

  }

  excluir(id: number) {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

}