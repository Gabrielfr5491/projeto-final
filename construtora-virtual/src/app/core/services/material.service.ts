import { Injectable } from '@angular/core';
import { Material } from '../../models/material';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private materiais: Material[] = [];

  constructor() {

    const dados =
      localStorage.getItem(
        'materiais'
      );

    if (dados) {
      this.materiais =
        JSON.parse(dados);
    }
  }

  salvarStorage() {

    localStorage.setItem(
      'materiais',
      JSON.stringify(
        this.materiais
      )
    );
  }

  listar() {
    return this.materiais;
  }

  adicionar(
    material: Material
  ) {

    this.materiais.push(
      material
    );

    this.salvarStorage();
  }

  excluir(id: number) {

    this.materiais =
      this.materiais.filter(
        m => m.id !== id
      );

    this.salvarStorage();
  }
}