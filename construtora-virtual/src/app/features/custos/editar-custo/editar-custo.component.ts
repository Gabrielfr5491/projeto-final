import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { CustoService } from '../../../core/services/custo.service';
import { ObraService } from '../../../core/services/obra.service';

import { Obra } from '../../../models/obra';

@Component({
  selector: 'app-editar-custo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-custo.component.html',
  styleUrl: './editar-custo.component.scss'
})
export class EditarCustoComponent implements OnInit {

  id!: number;

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
    private route: ActivatedRoute,
    private router: Router,
    private custoService: CustoService,
    private obraService: ObraService
  ) {}

  ngOnInit(): void {

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.carregarObras();

    this.carregarCusto();

  }

  carregarObras() {

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

  carregarCusto() {

    this.custoService
      .buscarPorId(this.id)
      .subscribe({

        next: (dados: any) => {

          this.custo = {

            descricao: dados.descricao,

            categoria: dados.categoria,

            valor: dados.valor,

            data: dados.data,

            obraId: dados.obra?.id || dados.obraId,

            tipo: dados.tipo

          };

        },

        error: (erro) => {

          console.error(
            'Erro ao carregar custo',
            erro
          );

        }

      });

  }

  atualizar() {

    this.custoService
      .atualizar(
        this.id,
        this.custo
      )
      .subscribe({

        next: () => {

          alert(
            'Custo atualizado com sucesso!'
          );

          this.router.navigate([
            '/custos'
          ]);

        },

        error: (erro) => {

          console.error(
            'Erro ao atualizar custo',
            erro
          );

          alert(
            'Erro ao atualizar custo'
          );

        }

      });

  }

}