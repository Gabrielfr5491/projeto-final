import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../core/services/layout.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(
    public layout: LayoutService,
    private auth: AuthService
  ) {}

  isAdmin(): boolean {
    const usuario = this.auth.getUsuario();
    const perfil = usuario?.perfil?.toLowerCase();
    return perfil === 'administrador' || perfil === 'admin';
  }
}