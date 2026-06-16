import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private api =
    'http://localhost:3000/dashboard';

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