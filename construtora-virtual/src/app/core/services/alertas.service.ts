import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alerta {
  id: string;
  tipo: 'danger' | 'warning' | 'info';
  categoria: 'obra' | 'financeiro' | 'material' | 'equipamento';
  titulo: string;
  mensagem: string;
  link?: string;
  criadoEm: string;
}

export interface ResumoAlertas {
  total: number;
  danger: number;
  warning: number;
  info: number;
}

@Injectable({ providedIn: 'root' })
export class AlertasService {

  private api = 'https://projeto-final-3-7epi.onrender.com';

  constructor(private http: HttpClient) {}

  listar(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.api}/alertas`);
  }

  resumo(): Observable<ResumoAlertas> {
    return this.http.get<ResumoAlertas>(`${this.api}/alertas/resumo`);
  }

}
