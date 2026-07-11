import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { CustoService } from '../../../core/services/custo.service';
import { ObraService } from '../../../core/services/obra.service';
import { ToastService } from '../../../core/services/toast.service';

import { Obra } from '../../../models/obra';

@Component({
  selector: 'app-cadastro-custo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
    private router: Router,
    private toast: ToastService
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
        this.toast.sucesso('Custo cadastrado com sucesso!');
        this.router.navigate(['/custos']);
      },
      error: (erro) => {
        console.error(erro);
        this.toast.erro('Erro ao cadastrar custo.');
      }

      });

  }

}