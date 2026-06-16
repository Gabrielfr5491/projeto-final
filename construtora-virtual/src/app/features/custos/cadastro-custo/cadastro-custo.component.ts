import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { CustoService } from '../../../core/services/custo.service';
import { ObraService } from '../../../core/services/obra.service';

import { Obra } from '../../../models/obra';

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
export class CadastroCustoComponent implements OnInit {

  obras: Obra[] = [];

  custo = {

  descricao: '',

  categoria: '',

  valor: 0,

  data: '',

  obraId: 0,

  tipo: ''



  };

  constructor(
    private custoService: CustoService,
    private obraService: ObraService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.obraService
      .listar()
      .subscribe({

        next: (dados) => {

          this.obras = dados;

        },

        error: (erro) => {

          console.error(
            'Erro ao carregar obras',
            erro
          );

        }

      });

  }

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

        },

        error: (erro) => {

          console.error(erro);

          alert(
            'Erro ao cadastrar custo'
          );

        }

      });

  }

}