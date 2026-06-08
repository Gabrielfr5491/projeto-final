import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// ATENÇÃO: Verifique se esses caminhos de importação batem exatamente com onde estão os seus arquivos físicos de Sidebar e Navbar!
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    SidebarComponent,  // <-- ATENÇÃO: Esse import precisa estar aqui no array!
    NavbarComponent    // <-- ATENÇÃO: Esse import precisa estar aqui no array!
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent { }