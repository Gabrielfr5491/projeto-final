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
export class CadastroObraComponent {
  collapsed: boolean = false;

  obra = {
    id: 0,
    nome: '',
    endereco: '',
    cidade: '',
    estado: '',
    dataInicio: '',
    dataPrevista: '',
    status: 'Planejamento',
    orcamento: 0,
    modelo3dBase64: '',
    modelo3dNome: '',
    modelo3dFormato: '',
    mapaEletricistaBase64: '',
    mapaEletricistaNome: '',
    pdfClausulasBase64: '',
    pdfClausulasNome: ''
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

  onFileSelected(event: Event, tipo: 'modelo3d' | 'mapa' | 'pdf'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      if (tipo === 'modelo3d') {
        this.obra.modelo3dBase64 = base64Data;
        this.obra.modelo3dNome = file.name;
        let ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (ext === 'glb') ext = 'gltf';
        this.obra.modelo3dFormato = ext;
      } else if (tipo === 'mapa') {
        this.obra.mapaEletricistaBase64 = base64Data;
        this.obra.mapaEletricistaNome = file.name;
      } else if (tipo === 'pdf') {
        this.obra.pdfClausulasBase64 = base64Data;
        this.obra.pdfClausulasNome = file.name;
      }
    };
    reader.readAsDataURL(file);
  }

  clearFile(tipo: 'modelo3d' | 'mapa' | 'pdf'): void {
    if (tipo === 'modelo3d') {
      this.obra.modelo3dBase64 = '';
      this.obra.modelo3dNome = '';
      this.obra.modelo3dFormato = '';
    } else if (tipo === 'mapa') {
      this.obra.mapaEletricistaBase64 = '';
      this.obra.mapaEletricistaNome = '';
    } else if (tipo === 'pdf') {
      this.obra.pdfClausulasBase64 = '';
      this.obra.pdfClausulasNome = '';
    }
  }

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
      orcamento: 0,
      modelo3dBase64: '',
      modelo3dNome: '',
      modelo3dFormato: '',
      mapaEletricistaBase64: '',
      mapaEletricistaNome: '',
      pdfClausulasBase64: '',
      pdfClausulasNome: ''
    };
  }
}