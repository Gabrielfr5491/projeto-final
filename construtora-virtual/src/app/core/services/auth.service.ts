import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {}

  login(email: string, senha: string) {

    return this.http.post<any>(
      'http://localhost:3000/auth/login',
      {
        email,
        senha
      }
    );

  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

  }

  estaLogado() {

    return !!localStorage.getItem('token');

  }

  getToken() {

    return localStorage.getItem('token');

  }

  getUsuario() {

    return JSON.parse(
      localStorage.getItem('usuario') || '{}'
    );

  }

}