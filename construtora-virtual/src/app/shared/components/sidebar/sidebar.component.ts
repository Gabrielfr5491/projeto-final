import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

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

  constructor(
    public layout: LayoutService,
    public auth: AuthService,
    private alertasService: AlertasService,
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
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  isAdmin(): boolean    { return this.auth.isAdmin(); }
  podeEditar(): boolean { return this.auth.podeEditar(); }
}
