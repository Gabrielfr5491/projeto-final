import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(email: string, senha: string) {

    if (
      email === 'admin@admin.com' &&
      senha === '123456'
    ) {

      localStorage.setItem(
        'usuario',
        JSON.stringify({
          nome: 'Administrador',
          email,
          perfil: 'ADMIN'
        })
      );

      return true;
    }

    return false;
  }

  logout() {
    localStorage.removeItem('usuario');
  }

  estaLogado() {
    return !!localStorage.getItem('usuario');
  }

  getUsuario() {
    return JSON.parse(
      localStorage.getItem('usuario') || '{}'
    );
  }
}