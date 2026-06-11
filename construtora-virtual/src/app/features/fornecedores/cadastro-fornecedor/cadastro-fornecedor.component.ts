import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  fornecedorId!: number;

  categorias = [
    { value: 'estrutural', label: 'Estrutural (Aço, Cimento)' },
    { value: 'acabamento', label: 'Acabamento (Pisos, Pintura)' },
    { value: 'eletrica', label: 'Elétrica e Hidráulica' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router // Alterado para public para o HTML conseguir acessar sem erros
  ) {
    this.criarFormulario();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdicao = true;
      this.fornecedorId = Number(idParam);
      this.carregarDadosDoFornecedor();
    } else {
      // Se for novo, inicia com uma linha de produto em branco
      this.adicionarProduto();
    }
  }

  criarFormulario() {
    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      categoria: ['', Validators.required],
      produtos: this.fb.array([]) // Array dinâmico para criar quantos produtos quiser
    });
  }

  // Getter para facilitar o loop no HTML
  get produtosFormArray(): FormArray {
    return this.fornecedorForm.get('produtos') as FormArray;
  }

  // Método auxiliar para evitar erros de compilação estrita de tipos no HTML (*ngFor)
  getControl(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  criarGrupoProduto(nomeProduto = '', precoBase = ''): FormGroup {
    return this.fb.group({
      nome: [nomeProduto, Validators.required], // Apenas o nome do insumo é estritamente obrigatório
      precoBase: [precoBase] // Removido o Validator.required para dar mais liberdade no catálogo
    });
  }

  // Cria uma nova linha limpa no formulário sempre que for chamado
  adicionarProduto(nome = '', preco = '') {
    this.produtosFormArray.push(this.criarGrupoProduto(nome, preco));
  }

  // Remove a linha selecionada de forma inteligente
  removerProduto(index: number) {
    if (this.produtosFormArray.length > 1) {
      this.produtosFormArray.removeAt(index);
    } else {
      // Se for o último produto restante, apenas limpa os campos em vez de barrar o usuário com alert
      this.produtosFormArray.at(0).reset({ nome: '', precoBase: '' });
    }
  }

  carregarDadosDoFornecedor() {
    // Exemplo de dados vindos da API/Mock com múltiplos produtos
    const fornecedorMock = {
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
    };

    this.produtosFormArray.clear();
    fornecedorMock.produtos.forEach(p => this.adicionarProduto(p.nome, p.precoBase));

    this.fornecedorForm.patchValue({
      nome: fornecedorMock.nome,
      cnpj: fornecedorMock.cnpj,
      telefone: fornecedorMock.telefone,
      email: fornecedorMock.email,
      categoria: fornecedorMock.categoria
    });
  }

  salvar() {
    if (this.fornecedorForm.valid) {
      // Captura todo o objeto estruturado incluindo o array completo de produtos cadastrados
      console.log('Dados do Fornecedor + Todos os Produtos:', this.fornecedorForm.value);
      this.router.navigate(['/fornecedores']);
    } else {
      this.fornecedorForm.markAllAsTouched();
    }
  }
}