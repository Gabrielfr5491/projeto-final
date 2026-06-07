import { Injectable } from '@angular/core';
import { Fornecedor } from '../../models/fornecedor';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  private fornecedores: Fornecedor[] = [];

  constructor() {

    const dados =
      localStorage.getItem(
        'fornecedores'
      );

    if (dados) {
      this.fornecedores =
        JSON.parse(dados);
    }
  }

  salvarStorage() {

    localStorage.setItem(
      'fornecedores',
      JSON.stringify(
        this.fornecedores
      )
    );
  }

  listar() {
    return this.fornecedores;
  }

  adicionar(
    fornecedor: Fornecedor
  ) {

    this.fornecedores.push(
      fornecedor
    );

    this.salvarStorage();
  }

  excluir(id: number) {

    this.fornecedores =
      this.fornecedores.filter(
        f => f.id !== id
      );

    this.salvarStorage();
  }
}