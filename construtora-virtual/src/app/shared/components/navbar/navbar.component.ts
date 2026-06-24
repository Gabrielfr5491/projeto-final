import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    public auth: AuthService,
    private router: Router,
    public theme: ThemeService,
    public layout: LayoutService
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate([
      '/login'
    ]);
  }
}