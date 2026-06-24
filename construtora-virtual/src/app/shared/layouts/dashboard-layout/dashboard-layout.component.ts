import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    NavbarComponent,
    ToastComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  constructor(public layout: LayoutService) {}
}