import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localePt from '@angular/common/locales/pt';

import { ObraService } from '../../../core/services/obra.service';
import { ToastService } from '../../../core/services/toast.service';
import { Obra } from '../../../models/obra';registerLocaleData(localePt);

@Component({
  selector: 'app-lista-obras',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './lista-obras.component.html',
  styleUrl: './lista-obras.component.scss'
})
export class ListaObrasComponent implements OnInit {  collapsed: boolean = false;

  filtro = '';
  obras: Obra[] = [];

  constructor(
    private obraService: ObraService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.carregarObras();
  }

  carregarObras() {
    this.obraService
      .listar()
      .subscribe({
        next: (dados) => {
          this.obras = dados;
        },
        error: (erro) => {
          console.error('Erro ao carregar obras', erro);
        }
      });
  }

  excluir(id: number) {    if (confirm('Tem certeza que deseja remover esta obra permanentemente?')) {
      this.obraService.excluir(id).subscribe({
        next: () => {
          this.toast.sucesso('Obra excluída com sucesso.');
          this.carregarObras();
        },
        error: (erro) => {
          console.error('Erro ao excluir obra', erro);
          this.toast.erro('Não foi possível excluir a obra. Verifique se há custos ou materiais vinculados.');
        }
      });
    }
  }  get obrasFiltradas() {
    return this.obras.filter(
      obra =>
        obra.nome
          .toLowerCase()
          .includes(
            this.filtro.toLowerCase()
          )
    );
  }
}