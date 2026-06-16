import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { CustoService } from '../../../core/services/custo.service';

@Component({
  selector: 'app-cadastro-custo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cadastro-custo.component.html',
  styleUrl: './cadastro-custo.component.scss'
})
export class CadastroCustoComponent {

  custo = {

    descricao: '',

    categoria: '',

    valor: 0,

    data: '',

    obra: '',

    tipo: ''

  };

  constructor(
    private custoService: CustoService,
    private router: Router
  ) {}

  salvar() {

    this.custoService
      .adicionar(this.custo)
      .subscribe({

        next: () => {

          alert(
            'Custo cadastrado com sucesso!'
          );

          this.router.navigate([
            '/custos'
          ]);

        }

      });

  }

}