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
  isSaving = false;

  // ─── Metadados da obra ──────────────────────────────────────────────────────
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

  // ─── Armazenar os File brutos até a hora de salvar ─────────────────────────
  private _modelo3dFile: File | null = null;
  private _mapaFile: File | null = null;
  private _pdfFile: File | null = null;

  constructor(
    private obraService: ObraService,
    private toast: ToastService,
    private router: Router
  ) {}

  // ─── Apenas armazena o File e exibe o nome; não lê ainda ──────────────────
  onFileSelected(event: Event, tipo: 'modelo3d' | 'mapa' | 'pdf'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (tipo === 'modelo3d') {
      this._modelo3dFile = file;
      this.obra.modelo3dNome = file.name;
      let ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (ext === 'glb') ext = 'gltf';
      this.obra.modelo3dFormato = ext;
    } else if (tipo === 'mapa') {
      this._mapaFile = file;
      this.obra.mapaEletricistaNome = file.name;
    } else if (tipo === 'pdf') {
      this._pdfFile = file;
      this.obra.pdfClausulasNome = file.name;
    }
  }

  clearFile(tipo: 'modelo3d' | 'mapa' | 'pdf'): void {
    if (tipo === 'modelo3d') {
      this._modelo3dFile = null;
      this.obra.modelo3dNome = '';
      this.obra.modelo3dFormato = '';
      this.obra.modelo3dBase64 = '';
    } else if (tipo === 'mapa') {
      this._mapaFile = null;
      this.obra.mapaEletricistaNome = '';
      this.obra.mapaEletricistaBase64 = '';
    } else if (tipo === 'pdf') {
      this._pdfFile = null;
      this.obra.pdfClausulasNome = '';
      this.obra.pdfClausulasBase64 = '';
    }
  }

  // ─── Converte um File para Base64 (retorna Promise) ────────────────────────
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error(`Erro ao ler o arquivo: ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  // ─── Aguarda TODOS os arquivos serem lidos antes de enviar ────────────────
  async salvar() {
    if (!this.obra.nome.trim()) {
      this.toast.erro('O nome da obra é obrigatório.');
      return;
    }

    this.isSaving = true;

    try {
      // Converte todos os arquivos para Base64 em paralelo
      const [modelo3dBase64, mapaBase64, pdfBase64] = await Promise.all([
        this._modelo3dFile ? this.fileToBase64(this._modelo3dFile) : Promise.resolve(''),
        this._mapaFile     ? this.fileToBase64(this._mapaFile)     : Promise.resolve(''),
        this._pdfFile      ? this.fileToBase64(this._pdfFile)      : Promise.resolve(''),
      ]);

      // Preenche o payload completo
      const payload = {
        ...this.obra,
        modelo3dBase64,
        mapaEletricistaBase64: mapaBase64,
        pdfClausulasBase64: pdfBase64,
      };

      this.obraService.adicionar(payload).subscribe({
        next: () => {
          this.toast.sucesso('Obra cadastrada com sucesso!');
          this.isSaving = false;
          this.router.navigate(['/obras']);
        },
        error: (erro) => {
          console.error('Erro ao cadastrar obra:', erro);
          this.toast.erro('Erro ao cadastrar obra. Verifique o tamanho dos arquivos.');
          this.isSaving = false;
        }
      });

    } catch (err) {
      console.error(err);
      this.toast.erro('Erro ao processar os arquivos. Tente novamente.');
      this.isSaving = false;
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
    this._modelo3dFile = null;
    this._mapaFile = null;
    this._pdfFile = null;
  }
}