import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    public auth: AuthService,
    private router: Router,
    public theme: ThemeService
  ) {}

  logout() {

    this.auth.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}