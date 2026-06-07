import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email = '';
  senha = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  entrar() {

    const sucesso =
      this.authService.login(
        this.email,
        this.senha
      );

    if (sucesso) {

      this.router.navigate([
        '/dashboard'
      ]);

      return;
    }

    alert('Email ou senha inválidos');
  }
}