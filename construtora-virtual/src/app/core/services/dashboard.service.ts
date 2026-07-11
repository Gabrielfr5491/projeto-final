import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private api =
    'https://projeto-final-3-7epi.onrender.com';

  constructor(
    private http: HttpClient
  ) {}

  resumo() {

    return this.http.get(
      `${this.api}/dashboard/resumo`
    );

  }

  financeiro() {

    return this.http.get<any>(
      `${this.api}/dashboard/financeiro`
    );

  }

  custosPorObra() {

    return this.http.get<{
      obras: string[];
      entradas: number[];
      saidas: number[];
      totais: number[];
    }>(`${this.api}/dashboard/custos-por-obra`);

  }

  evm() {

    return this.http.get<{
      meses: string[];
      pv: number[];
      ac: number[];
      ev: number[];
    }>(`${this.api}/dashboard/evm`);

  }

}