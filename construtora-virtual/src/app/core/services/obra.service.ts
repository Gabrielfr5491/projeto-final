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
    'https://projeto-final-3-7epi.onrender.com';

  listar(): Observable<Obra[]> {

    return this.http.get<Obra[]>(
      `${this.api}/obras`
    );

  }

  buscarPorId(id: number): Observable<Obra> {

    return this.http.get<Obra>(
      `${this.api}/obras/${id}`
    );

  }

  adicionar(obra: Obra) {

    return this.http.post(
      `${this.api}/obras`,
      obra
    );

  }

  excluir(id: number) {

    return this.http.delete(
      `${this.api}/obras/${id}`
    );

  }

  atualizar(obra: Obra) {

    return this.http.patch(
      `${this.api}/obras/${obra.id}`,
      obra
    );

  }

}