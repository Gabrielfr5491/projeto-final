import { Injectable } from '@angular/core';
import { Obra } from '../../models/obra';

@Injectable({
  providedIn: 'root'
})
export class ObraService {

  private obras: Obra[] = [];

  constructor() {
    const dados = localStorage.getItem('obras');

    if (dados) {
      this.obras = JSON.parse(dados);
    }
  }

  private salvarStorage() {
    localStorage.setItem(
      'obras',
      JSON.stringify(this.obras)
    );
  }

  listar(): Obra[] {
    return this.obras;
  }

  adicionar(obra: Obra) {
    this.obras.push(obra);
    this.salvarStorage();
  }

  excluir(id: number) {
    this.obras =
      this.obras.filter(
        obra => obra.id !== id
      );

    this.salvarStorage();
  }

  atualizar(obraAtualizada: Obra) {

    const index =
      this.obras.findIndex(
        obra => obra.id === obraAtualizada.id
      );

    if (index !== -1) {

      this.obras[index] =
        obraAtualizada;

      this.salvarStorage();
    }
  }
}