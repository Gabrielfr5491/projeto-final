import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AlertasService, Alerta } from '../../core/services/alertas.service';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './alertas.component.html',
  styleUrl: './alertas.component.scss',
})
export class AlertasComponent implements OnInit {

  alertas: Alerta[] = [];
  carregando = false;

  filtroTipo: '' | 'danger' | 'warning' | 'info' = '';
  filtroCategoria: '' | 'obra' | 'financeiro' | 'material' | 'equipamento' = '';

  constructor(private alertasService: AlertasService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.alertasService.listar().subscribe({
      next: d => { this.alertas = d; this.carregando = false; },
      error: () => { this.carregando = false; },
    });
  }

  get alertasFiltrados(): Alerta[] {
    return this.alertas.filter(a => {
      const matchTipo = !this.filtroTipo || a.tipo === this.filtroTipo;
      const matchCat  = !this.filtroCategoria || a.categoria === this.filtroCategoria;
      return matchTipo && matchCat;
    });
  }

  get totalDanger()  { return this.alertas.filter(a => a.tipo === 'danger').length;  }
  get totalWarning() { return this.alertas.filter(a => a.tipo === 'warning').length; }
  get totalInfo()    { return this.alertas.filter(a => a.tipo === 'info').length;    }

  limparFiltros() {
    this.filtroTipo = '';
    this.filtroCategoria = '';
  }

  iconeTipo(tipo: string): string {
    if (tipo === 'danger')  return 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01';
    if (tipo === 'warning') return 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01';
    return 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01';
  }

  iconeCategoria(cat: string): string {
    if (cat === 'obra')       return 'M3 21h18M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2M5 21V7m14 14V7';
    if (cat === 'financeiro') return 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6';
    if (cat === 'material')   return 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z';
    return 'M3 17h18M5 17V9l4-4h6l4 4v8M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z';
  }

}
