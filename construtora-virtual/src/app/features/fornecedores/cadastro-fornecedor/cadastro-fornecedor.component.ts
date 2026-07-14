import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FornecedorService } from '../../../core/services/fornecedor.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cadastro-fornecedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-fornecedor.component.html',
  styleUrl: './cadastro-fornecedor.component.scss'
})
export class CadastroFornecedorComponent implements OnInit {
  
  fornecedorForm!: FormGroup;
  isEdicao = false;

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
    private fornecedorService: FornecedorService,
    private toast: ToastService,
    public router: Router
  ) {
    this.criarFormulario();
  }

  ngOnInit(): void {}

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

  salvar() {
    if (this.fornecedorForm.valid) {
      const payload = { ...this.fornecedorForm.value };
      delete payload.produtos; // Backend não espera produtos no cadastro de fornecedor
      
      this.fornecedorService.adicionar(payload).subscribe({
        next: () => {
          this.toast.sucesso('Fornecedor cadastrado com sucesso.');
          this.router.navigate(['/fornecedores']);
        },
        error: () => {
          this.toast.erro('Erro ao cadastrar fornecedor.');
        }
      });
    } else {
      this.fornecedorForm.markAllAsTouched();
      this.toast.aviso('Preencha todos os campos obrigatórios.');
    }
  }
}
