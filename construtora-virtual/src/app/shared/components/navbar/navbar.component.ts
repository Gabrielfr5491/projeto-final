import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { AlertasService, ResumoAlertas } from '../../../core/services/alertas.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  resumoAlertas: ResumoAlertas = { total: 0, danger: 0, warning: 0, info: 0 };
  private sub?: Subscription;

  constructor(
    public auth: AuthService,
    private router: Router,
    public theme: ThemeService,
    public layout: LayoutService,
    private alertasService: AlertasService,
  ) {
    console.log('✅ NavbarComponent initialized with LayoutService:', !!this.layout);
  }

  ngOnInit(): void {
    // Busca o resumo de alertas ao iniciar e refresca a cada 5 minutos
    this.sub = interval(5 * 60 * 1000).pipe(
      startWith(0),
      switchMap(() => this.alertasService.resumo()),
    ).subscribe({
      next: r => { this.resumoAlertas = r; },
      error: () => { /* falha silenciosa, não bloqueia a UI */ },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get totalAlertas(): number {
    return this.resumoAlertas.total;
  }

  get classBadge(): string {
    if (this.resumoAlertas.danger > 0) return 'badge--danger';
    if (this.resumoAlertas.warning > 0) return 'badge--warning';
    return 'badge--info';
  }

  toggleMenu() {
    console.log('🍔 Botão hambúrguer clicado!');
    console.log('Layout service exists?', !!this.layout);
    if (this.layout) {
      this.layout.toggleMobileSidebar();
    } else {
      console.error('❌ LayoutService não está disponível!');
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
