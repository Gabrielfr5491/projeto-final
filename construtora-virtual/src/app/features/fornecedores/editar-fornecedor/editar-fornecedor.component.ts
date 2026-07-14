import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
      endereco: ['', Validators.required],
      categoria: ['', Validators.required],
      status: ['Ativo', Validators.required]
    });
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
      this.fornecedorService.atualizar(this.fornecedorId, this.fornecedorForm.value).subscribe({
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
