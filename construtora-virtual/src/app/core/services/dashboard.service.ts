import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) {}

  resumo() {

    return this.http.get(
      'http://localhost:3000/dashboard/resumo'
    );

  }

}