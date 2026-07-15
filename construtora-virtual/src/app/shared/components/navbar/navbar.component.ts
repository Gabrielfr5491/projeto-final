import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
    console.log('✅ NavbarComponent initialized');
    console.log('LayoutService disponível?', !!this.layout);
  }

  ngOnInit(): void {
    this.sub = interval(5 * 60 * 1000).pipe(
      startWith(0),
      switchMap(() => this.alertasService.resumo()),
    ).subscribe({
      next: r => { this.resumoAlertas = r; },
      error: () => {},
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

  // Método principal que abre/fecha o menu
  toggleMenu(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('🍔 CLICK NO HAMBÚRGUER!');
    console.log('Tipo de evento:', event?.type);
    console.log('Window width:', window.innerWidth);
    
    if (this.layout) {
      this.layout.toggleMobileSidebar();
      console.log('✅ Toggle chamado com sucesso');
    } else {
      console.error('❌ LayoutService não existe!');
    }
  }

  // HostListener para capturar touch events
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.navbar-custom__hamburger')) {
      console.log('👆 TOUCH START detectado no hambúrguer!');
      this.toggleMenu(event);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
