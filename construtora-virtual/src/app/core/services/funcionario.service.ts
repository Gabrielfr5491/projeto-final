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

  excluir(id: number | string) {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

  adicionar(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.api, funcionario);
  }

}