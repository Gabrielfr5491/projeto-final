import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private api = 'http://localhost:3000/usuarios';

  constructor(
    private http: HttpClient
  ) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/${id}`);
  }

  adicionar(usuario: Usuario): Observable<any> {
    return this.http.post(this.api, usuario);
  }

  atualizar(id: number, usuario: Usuario): Observable<any> {
    return this.http.patch(`${this.api}/${id}`, usuario);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

}
