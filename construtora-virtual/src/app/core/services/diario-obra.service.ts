import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DiarioEntrada } from '../../models/diario-obra';

@Injectable({
  providedIn: 'root'
})
export class DiarioObraService {

  private http = inject(HttpClient);

  private api = 'https://projeto-final-3-7epi.onrender.com';

  listar(): Observable<DiarioEntrada[]> {
    return this.http.get<DiarioEntrada[]>(`${this.api}/diario`);
  }

  listarPorObra(obraId: number): Observable<DiarioEntrada[]> {
    return this.http.get<DiarioEntrada[]>(`${this.api}/diario/obra/${obraId}`);
  }

  buscarPorId(id: number): Observable<DiarioEntrada> {
    return this.http.get<DiarioEntrada>(`${this.api}/diario/${id}`);
  }

  adicionar(entrada: DiarioEntrada): Observable<DiarioEntrada> {
    return this.http.post<DiarioEntrada>(`${this.api}/diario`, entrada);
  }

  atualizar(entrada: DiarioEntrada): Observable<DiarioEntrada> {
    return this.http.patch<DiarioEntrada>(
      `${this.api}/diario/${entrada.id}`,
      entrada
    );
  }

  excluir(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/diario/${id}`);
  }

}
