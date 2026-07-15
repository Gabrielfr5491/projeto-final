import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith, filter } from 'rxjs/operators';

import { LayoutService } from '../../../core/services/layout.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlertasService } from '../../../core/services/alertas.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  totalAlertas = 0;
  temCritico = false;

  private sub?: Subscription;
  private routerSub?: Subscription;

  constructor(
    public layout: LayoutService,
    public auth: AuthService,
    private alertasService: AlertasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = interval(5 * 60 * 1000).pipe(
      startWith(0),
      switchMap(() => this.alertasService.resumo()),
    ).subscribe({
      next: r => {
        this.totalAlertas = r.total;
        this.temCritico   = r.danger > 0;
      },
      error: () => {},
    });

    // Fecha sidebar mobile quando navegar para nova rota
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (window.innerWidth <= 768) {
        this.layout.setMobileSidebarOpen(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  isAdmin(): boolean    { return this.auth.isAdmin(); }
  podeEditar(): boolean { return this.auth.podeEditar(); }
}
