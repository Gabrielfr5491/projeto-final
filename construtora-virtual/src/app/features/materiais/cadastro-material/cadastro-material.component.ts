import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MaterialService } from '../../../core/services/material.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cadastro-material',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cadastro-material.component.html',
  styleUrl: './cadastro-material.component.scss'
})
export class CadastroMaterialComponent {

  material = {
    nome: '',
    categoria: '',
    unidade: '',
    valorUnitario: 0,
    quantidade: 0,
    estoqueMinimo: 0,
    fornecedor: ''
  };

  constructor(
    private materialService: MaterialService,
    private router: Router,
    private toast: ToastService
  ) {}

  salvar() {

    this.materialService
      .adicionar(this.material)
      .subscribe({

        next: () => {
          this.toast.sucesso('Material cadastrado com sucesso!');
          this.router.navigate(['/materiais']);
        },

        error: (erro) => {

          console.error(erro);

          this.toast.erro('Erro ao cadastrar material.');

        }

      });

  }

  cancelar() {

    this.router.navigate([
      '/materiais'
    ]);

  }

}