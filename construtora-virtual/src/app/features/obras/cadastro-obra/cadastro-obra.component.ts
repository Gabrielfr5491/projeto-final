import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ObraService }
from '../../../core/services/obra.service';

@Component({
  selector: 'app-cadastro-obra',
  standalone: true,
  imports: [FormsModule],
  templateUrl:
  './cadastro-obra.component.html'
})
export class CadastroObraComponent {

  obra = {
    id: 0,
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    dataInicio: '',
    dataPrevista: '',
    status: '',
    orcamento: 0
  };

  constructor(
    private obraService: ObraService
  ) {}

  salvar() {

  this.obraService
    .adicionar(this.obra)
    .subscribe({

      next: () => {

        alert(
          'Obra cadastrada com sucesso!'
        );

      },

      error: erro => {

        console.error(erro);

      }

    });

  }
}