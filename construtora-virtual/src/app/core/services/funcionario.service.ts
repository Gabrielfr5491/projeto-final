import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Funcionario } from '../../models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private api =
    'https://projeto-final-3-7epi.onrender.com';

  constructor(
    private http: HttpClient
  ) {}

  listar(): Observable<Funcionario[]> {

    return this.http.get<Funcionario[]>(
      `${this.api}/funcionarios`
    );

  }

  buscarPorId(
    id: number
  ): Observable<Funcionario> {

    return this.http.get<Funcionario>(
      `${this.api}/funcionarios/${id}`
    );

  }

  adicionar(
    funcionario: Funcionario
  ) {

    return this.http.post(
      `${this.api}/funcionarios`,
      funcionario
    );

  }

  atualizar(
    id: number,
    funcionario: Funcionario
  ) {

    return this.http.patch(
      `${this.api}/funcionarios/${id}`,
      funcionario
    );

  }

  excluir(id: number) {

    return this.http.delete(
      `${this.api}/funcionarios/${id}`
    );

  }

}