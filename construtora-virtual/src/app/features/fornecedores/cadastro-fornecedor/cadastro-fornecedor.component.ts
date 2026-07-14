import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
      endereco: ['', Validators.required],
      categoria: ['', Validators.required],
      status: ['Ativo', Validators.required]
    });
  }

  salvar() {
    if (this.fornecedorForm.valid) {
      this.fornecedorService.adicionar(this.fornecedorForm.value).subscribe({
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
