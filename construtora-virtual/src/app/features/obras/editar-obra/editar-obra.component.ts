import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ObraService } from '../../../core/services/obra.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-editar-obra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-obra.component.html',
  styleUrl: './editar-obra.component.scss'
})
export class EditarObraComponent implements OnInit {

  id!: number;
  isSaving = false;
  carregando = true;

  obra: any = {
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

  private _modelo3dFile: File | null = null;
  private _mapaFile: File | null = null;
  private _pdfFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private obraService: ObraService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.obraService.buscarPorId(this.id).subscribe({
      next: (dados) => {
        this.obra = { ...dados };
        this.carregando = false;
      },
      error: () => {
        this.toast.erro('Obra não encontrada.');
        this.router.navigate(['/obras']);
      }
    });
  }

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

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error(`Erro ao ler: ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  async salvar() {
    if (!this.obra.nome?.trim()) {
      this.toast.erro('O nome da obra é obrigatório.');
      return;
    }

    this.isSaving = true;

    try {
      const [modelo3dBase64, mapaBase64, pdfBase64] = await Promise.all([
        this._modelo3dFile ? this.fileToBase64(this._modelo3dFile) : Promise.resolve(this.obra.modelo3dBase64 || ''),
        this._mapaFile     ? this.fileToBase64(this._mapaFile)     : Promise.resolve(this.obra.mapaEletricistaBase64 || ''),
        this._pdfFile      ? this.fileToBase64(this._pdfFile)      : Promise.resolve(this.obra.pdfClausulasBase64 || ''),
      ]);

      const payload = {
        ...this.obra,
        modelo3dBase64,
        mapaEletricistaBase64: mapaBase64,
        pdfClausulasBase64: pdfBase64,
      };

      this.obraService.atualizar(payload).subscribe({
        next: () => {
          this.toast.sucesso('Obra atualizada com sucesso!');
          this.isSaving = false;
          this.router.navigate(['/obras']);
        },
        error: () => {
          this.toast.erro('Erro ao atualizar a obra.');
          this.isSaving = false;
        }
      });
    } catch {
      this.toast.erro('Erro ao processar os arquivos. Tente novamente.');
      this.isSaving = false;
    }
  }

  cancelar() {
    this.router.navigate(['/obras']);
  }
}
