import { Injectable } from '@angular/core';
import { Funcionario } from '../../models/funcionario';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private funcionarios: Funcionario[] = [];

  constructor() {
    const dados = localStorage.getItem('funcionarios');

    if (dados) {
      this.funcionarios = JSON.parse(dados);
    }
  }

  salvarStorage() {
    localStorage.setItem(
      'funcionarios',
      JSON.stringify(this.funcionarios)
    );
  }

  listar() {
    return this.funcionarios;
  }

  adicionar(funcionario: Funcionario) {
    this.funcionarios.push(funcionario);
    this.salvarStorage();
  }

  excluir(id: number) {
    this.funcionarios =
      this.funcionarios.filter(
        f => f.id !== id
      );

    this.salvarStorage();
  }
}