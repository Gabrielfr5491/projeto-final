import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ObraService } from '../../../core/services/obra.service';

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
    private obraService: ObraService
  ) {}

  salvar() {
    this.obraService
      .adicionar(this.obra)
      .subscribe({
        next: () => {
          alert('Obra cadastrada com sucesso!');
          
          // Limpa o formulário após salvar com sucesso
          this.resetForm();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar obra:', erro);
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