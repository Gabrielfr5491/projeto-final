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
      `${this.api}/resumo`
    );

  }

  financeiro() {

    return this.http.get<any>(
      `${this.api}/financeiro`
    );

  }

}