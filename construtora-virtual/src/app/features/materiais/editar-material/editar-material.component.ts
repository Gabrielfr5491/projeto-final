import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { MaterialService } from '../../../core/services/material.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-editar-material',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-material.component.html',
  styleUrl: './editar-material.component.scss'
})
export class EditarMaterialComponent
implements OnInit {

  id!: number;

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
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.carregarMaterial();

  }

  carregarMaterial() {

    this.materialService
      .buscarPorId(this.id)
      .subscribe({

        next: (dados: any) => {
          this.material = dados;
        },

        error: (erro) => {
          console.error(erro);
        }

      });

  }

  atualizar() {

    this.materialService
      .atualizar(
        this.id,
        this.material
      )
      .subscribe({

        next: () => {
          this.toast.sucesso('Material atualizado com sucesso!');
          this.router.navigate(['/materiais']);
        },
        error: (erro) => {
          console.error(erro);
          this.toast.erro('Erro ao atualizar material.');
        }

      });

  }

  cancelar() {

    this.router.navigate([
      '/materiais'
    ]);

  }

}