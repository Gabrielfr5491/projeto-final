import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localePt from '@angular/common/locales/pt';

import { ObraService } from '../../../core/services/obra.service';
import { ToastService } from '../../../core/services/toast.service';
import { Obra } from '../../../models/obra';

// Registra a localização brasileira para que o pipe 'currency' funcione perfeitamente na tabela
registerLocaleData(localePt);

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
  styleUrl: './lista-obras.component.scss' // Vinculação com o SCSS Premium
})
export class ListaObrasComponent implements OnInit {

  // Sincroniza a largura e o recuo da tabela com a abertura/fechamento da barra lateral
  collapsed: boolean = false;

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

  excluir(id: number) {
    // Um leve aviso nativo antes de deletar diretamente para melhorar a experiência do usuário (UX)
    if (confirm('Tem certeza que deseja remover esta obra permanentemente?')) {
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
  }

  // Seu filtro inteligente por aproximação de string (Case Insensitive)
  get obrasFiltradas() {
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