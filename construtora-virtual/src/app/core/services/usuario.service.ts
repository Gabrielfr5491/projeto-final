import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private api = 'https://projeto-final-3-7epi.onrender.com';

  constructor(
    private http: HttpClient
  ) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.api}/usuarios`);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/usuarios/${id}`);
  }

  adicionar(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.api}/usuarios`, usuario);
  }

  atualizar(id: number, usuario: Usuario): Observable<any> {
    return this.http.patch(`${this.api}/usuarios/${id}`, usuario);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.api}/usuarios/${id}`);
  }

}
