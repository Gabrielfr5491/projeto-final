import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FornecedorService } from '../../../core/services/fornecedor.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-editar-fornecedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-fornecedor.component.html',
  styleUrl: './editar-fornecedor.component.scss'
})
export class EditarFornecedorComponent implements OnInit {
  
  fornecedorForm!: FormGroup;
  fornecedorId!: number;
  carregando = true;
  imagemPreview: string | null = null;

  categorias = [
    { value: 'Materiais de Construção', label: 'Materiais de Construção' },
    { value: 'Ferramentas', label: 'Ferramentas e Equipamentos' },
    { value: 'Elétrica', label: 'Elétrica e Iluminação' },
    { value: 'Hidráulica', label: 'Hidráulica e Saneamento' },
    { value: 'Acabamento', label: 'Acabamento e Revestimentos' },
    { value: 'Estrutural', label: 'Estruturas Metálicas' },
    { value: 'Outros', label: 'Outros' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private fornecedorService: FornecedorService,
    private toast: ToastService
  ) {
    this.criarFormulario();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.fornecedorId = Number(idParam);
      this.carregar();
    }
  }

  criarFormulario() {
    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: [''],
      categoria: ['', Validators.required],
      status: ['Ativo', Validators.required],
      produtos: this.fb.array([])
    });
  }

  get produtosFormArray(): FormArray {
    return this.fornecedorForm.get('produtos') as FormArray;
  }

  getControl(item: any): FormGroup {
    return item as FormGroup;
  }

  adicionarProduto() {
    const produtoGroup = this.fb.group({
      nome: ['', Validators.required],
      precoBase: [0]
    });
    this.produtosFormArray.push(produtoGroup);
  }

  removerProduto(index: number) {
    this.produtosFormArray.removeAt(index);
  }

  aoSelecionarImagem(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagemPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  carregar() {
    this.fornecedorService.buscarPorId(this.fornecedorId).subscribe({
      next: (fornecedor) => {
        this.fornecedorForm.patchValue(fornecedor);
        this.carregando = false;
      },
      error: () => {
        this.toast.erro('Erro ao carregar fornecedor.');
        this.router.navigate(['/fornecedores']);
      }
    });
  }

  salvar() {
    if (this.fornecedorForm.valid) {
      const payload = { ...this.fornecedorForm.value };
      delete payload.produtos; // Backend não espera produtos no update de fornecedor
      
      this.fornecedorService.atualizar(this.fornecedorId, payload).subscribe({
        next: () => {
          this.toast.sucesso('Fornecedor atualizado com sucesso.');
          this.router.navigate(['/fornecedores']);
        },
        error: () => {
          this.toast.erro('Erro ao atualizar fornecedor.');
        }
      });
    } else {
      this.fornecedorForm.markAllAsTouched();
      this.toast.aviso('Preencha todos os campos obrigatórios.');
    }
  }
}
