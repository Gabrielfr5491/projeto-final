import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'https://projeto-final-3-7epi.onrender.com';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string) {
    return this.http.post<any>(`${this.api}/auth/login`, { email, senha });
  }

  /** Cadastro público — sempre cria com perfil admin */
  registro(nome: string, email: string, senha: string) {
    return this.http.post<any>(`${this.api}/auth/registro`, { nome, email, senha });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  estaLogado(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): any {
    return JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  getPerfil(): string {
    return (this.getUsuario()?.perfil ?? '').toLowerCase();
  }

  isAdmin(): boolean {
    return this.getPerfil() === 'admin';
  }

  isGerente(): boolean {
    return this.getPerfil() === 'gerente';
  }

  isComum(): boolean {
    return this.getPerfil() === 'comum';
  }

  /** Verdadeiro para admin e gerente — pode criar/editar/excluir */
  podeEditar(): boolean {
    const p = this.getPerfil();
    return p === 'admin' || p === 'gerente';
  }
}
