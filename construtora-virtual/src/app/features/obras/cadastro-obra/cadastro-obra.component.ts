import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ObraService } from '../../../core/services/obra.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-obra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-obra.component.html',
  styleUrl: './cadastro-obra.component.scss' // Garante o vínculo com o arquivo de estilo premium
})
export class CadastroObraComponent {

  // Sincroniza o layout do formulário com a abertura/fechamento da barra lateral
  collapsed: boolean = false;

  obra = {
    id: 0,
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    dataInicio: '',
    dataPrevista: '',
    status: 'Planejamento', // Definido um valor padrão inicial válido para o select
    orcamento: 0
  };

  constructor(
    private obraService: ObraService,
    private toast: ToastService,
    private router: Router
  ) {}

  salvar() {
    this.obraService.adicionar(this.obra).subscribe({
      next: () => {
        this.toast.sucesso('Obra cadastrada com sucesso!');
        this.router.navigate(['/obras']);
      },
      error: (erro) => {
        console.error('Erro ao cadastrar obra:', erro);
        this.toast.erro('Erro ao cadastrar obra.');
      }
    });
  }

  // Função auxiliar para resetar os campos após o envio com sucesso
  private resetForm() {
    this.obra = {
      id: 0,
      nome: '',
      endereco: '',
      cidade: '',
      estado: '',
      dataInicio: '',
      dataPrevista: '',
      status: 'Planejamento',
      orcamento: 0
    };
  }
}