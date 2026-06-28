import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';export interface ProdutoFornecedor {
  nome: string;
  precoBase: number;
}

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  produtos: ProdutoFornecedor[];
}

@Component({
  selector: 'app-lista-fornecedores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-fornecedores.component.html',
  styleUrl: './lista-fornecedores.component.scss'
})
export class ListaFornecedoresComponent implements OnInit {  fornecedorExpandidoId: number | null = null;  fornecedores: Fornecedor[] = [
    {
      id: 1,
      nome: 'Gerdau Comercial de Aços S.A.',
      cnpj: '12.345.678/0001-90',
      telefone: '(11) 99999-9999',
      email: 'vendas@gerdau.com',
      status: 'Ativo',
      produtos: [
        { nome: 'Vergalhão CA-50 10mm', precoBase: 54.90 },
        { nome: 'Arame Recozido Fio 18', precoBase: 14.50 },
        { nome: 'Malha de Aço Pop EQ092', precoBase: 115.00 }
      ]
    },
    {
      id: 2,
      nome: 'Votorantim Cimentos',
      cnpj: '98.765.432/0001-10',
      telefone: '(21) 98888-8888',
      email: 'suprimentos@votorantim.com',
      status: 'Ativo',
      produtos: [
        { nome: 'Cimento CP-II Votoran 50kg', precoBase: 38.50 }
      ]
    },
    {
      id: 3,
      nome: 'Madeireira Rio Claro Ltda',
      cnpj: '45.678.123/0002-40',
      telefone: '(71) 97777-7777',
      email: 'contato@rioclaromadeiras.com',
      status: 'Inativo',
      produtos: []
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.carregarFornecedores();
  }  toggleFornecedor(id: number): void {
    this.fornecedorExpandidoId = this.fornecedorExpandidoId === id ? null : id;
  }

  carregarFornecedores(): void {    console.log('Fornecedores carregados com portfólio de produtos.');
  }

  excluirFornecedor(id: number): void {
    if (confirm('Tem certeza que deseja remover este fornecedor e todo o seu catálogo de produtos?')) {
      this.fornecedores = this.fornecedores.filter(f => f.id !== id);
      console.log(`Fornecedor ${id} removido.`);
    }
  }
}