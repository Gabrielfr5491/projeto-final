import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  imagemPreview: string | null = null;

  categorias = [
    { value: 'estrutural', label: 'Estrutural (Aço, Cimento)' },
    { value: 'acabamento', label: 'Acabamento (Pisos, Pintura)' },
    { value: 'eletrica', label: 'Elétrica e Hidráulica' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.criarFormulario();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.fornecedorId = Number(idParam);
      this.carregarDadosDoFornecedor();
    }
  }

  criarFormulario() {
    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      categoria: ['', Validators.required],
      produtos: this.fb.array([])
    });
  }  get produtosFormArray(): FormArray {
    return this.fornecedorForm.get('produtos') as FormArray;
  }  getControl(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  criarGrupoProduto(nomeProduto = '', precoBase = ''): FormGroup {
    return this.fb.group({
      nome: [nomeProduto, Validators.required],
      precoBase: [precoBase]
    });
  }  adicionarProduto(nome = '', preco = '') {
    this.produtosFormArray.push(this.criarGrupoProduto(nome, preco));
  }  removerProduto(index: number) {
    if (this.produtosFormArray.length > 1) {
      this.produtosFormArray.removeAt(index);
    } else {
      this.produtosFormArray.at(0).reset({ nome: '', precoBase: '' });
    }
  }

  carregarDadosDoFornecedor() {    const fornecedorMock = {
      nome: 'Gerdau Comercial de Aços',
      cnpj: '12.345.678/0001-90',
      telefone: '11999999999',
      email: 'vendas@gerdau.com',
      categoria: 'estrutural',
      produtos: [
        { nome: 'Vergalhão CA-50 10mm', precoBase: '54.90' },
        { nome: 'Arame Recozido Fio 18', precoBase: '14.50' },
        { nome: 'Malha de Aço Pop EQ092', precoBase: '115.00' }
      ]
    };    this.produtosFormArray.clear();
    if (fornecedorMock.produtos && fornecedorMock.produtos.length > 0) {
      fornecedorMock.produtos.forEach(p => this.adicionarProduto(p.nome, p.precoBase));
    } else {
      this.adicionarProduto();
    }    this.fornecedorForm.patchValue({
      nome: fornecedorMock.nome,
      cnpj: fornecedorMock.cnpj,
      telefone: fornecedorMock.telefone,
      email: fornecedorMock.email,
      categoria: fornecedorMock.categoria
    });
  }  aoSelecionarImagem(event: any) {
    const arquivo = event.target.files[0];
    if (arquivo) {
      const reader = new FileReader();
      reader.onload = () => this.imagemPreview = reader.result as string;
      reader.readAsDataURL(arquivo);
    }
  }

  salvar() {
    if (this.fornecedorForm.valid) {
      console.log(`Atualizando fornecedor ID ${this.fornecedorId}:`, this.fornecedorForm.value);      this.router.navigate(['/fornecedores']);
    } else {
      this.fornecedorForm.markAllAsTouched();
    }
  }
}