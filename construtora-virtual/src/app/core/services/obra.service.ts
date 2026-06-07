import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Obra } from '../../models/obra';

@Injectable({
  providedIn: 'root'
})
export class ObraService {

  private http = inject(HttpClient);

  private api =
    'http://localhost:3000/obras';

  listar(): Observable<Obra[]> {

    return this.http.get<Obra[]>(
      this.api
    );

  }

  adicionar(obra: Obra) {

    return this.http.post(
      this.api,
      obra
    );

  }

  excluir(id: number) {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

  atualizar(obra: Obra) {

    return this.http.patch(
      `${this.api}/${obra.id}`,
      obra
    );

  }

}