import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Material } from '../../models/material';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private api =
    'https://projeto-final-3-7epi.onrender.com';

  constructor(
    private http: HttpClient
  ) {}

  listar() {
    return this.http.get<Material[]>(
      this.api
    );
  }

  buscarPorId(id: number) {
    return this.http.get<Material>(
      `${this.api}/${id}`
    );
  }

  adicionar(material: Material) {
    return this.http.post(
      this.api,
      material
    );
  }

  atualizar(
    id: number,
    material: Material
  ) {
    return this.http.patch(
      `${this.api}/${id}`,
      material
    );
  }

  excluir(id: number) {
    return this.http.delete(
      `${this.api}/${id}`
    );
  }

}