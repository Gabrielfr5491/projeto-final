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
  styleUrl: './cadastro-obra.component.scss'
})
export class CadastroObraComponent {  collapsed: boolean = false;

  obra = {
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
  }  private resetForm() {
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