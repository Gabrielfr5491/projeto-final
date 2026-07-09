import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Modelo3dPayload {
  obraId?: number;
  nome: string;
  formato: string;
  modeloBase64?: string;
  anotacoes?: any[];
  medicoes?: any[];
  iluminacao?: any;
  modoRenderizacao?: string;
}

export interface Modelo3dResponse extends Modelo3dPayload {
  id: number;
  criadoEm: string;
  atualizadoEm: string;
}

@Injectable({ providedIn: 'root' })
export class Modelo3dApiService {
  private readonly api = 'https://projeto-final-3-7epi.onrender.com/modelo3d';

  constructor(private http: HttpClient) {}

  /** Salva um novo projeto 3D no banco */
  salvar(payload: Modelo3dPayload): Observable<Modelo3dResponse> {
    return this.http.post<Modelo3dResponse>(this.api, payload);
  }

  /** Atualiza pins, anotações, medições ou iluminação de um projeto existente */
  atualizar(id: number, payload: Partial<Modelo3dPayload>): Observable<Modelo3dResponse> {
    return this.http.patch<Modelo3dResponse>(`${this.api}/${id}`, payload);
  }

  /** Lista todos os projetos 3D */
  listar(): Observable<Modelo3dResponse[]> {
    return this.http.get<Modelo3dResponse[]>(this.api);
  }

  /** Lista projetos vinculados a uma obra específica */
  listarPorObra(obraId: number): Observable<Modelo3dResponse[]> {
    return this.http.get<Modelo3dResponse[]>(`${this.api}/obra/${obraId}`);
  }

  /** Busca um projeto pelo ID */
  buscar(id: number): Observable<Modelo3dResponse> {
    return this.http.get<Modelo3dResponse>(`${this.api}/${id}`);
  }

  /** Remove um projeto 3D */
  deletar(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
