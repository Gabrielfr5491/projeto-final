import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RelatorioFinanceiro {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  porCategoria: Record<string, { entradas: number; saidas: number; total: number }>;
  evolucao: { mes: string; entradas: number; saidas: number; saldo: number }[];
  itens: {
    id: number;
    descricao: string;
    categoria: string;
    tipo: string;
    valor: number;
    data: string;
    obra: string;
  }[];
}

export interface RelatorioFuncionarios {
  total: number;
  ativos: number;
  inativos: number;
  totalFolha: number;
  mediaSalarial: number;
  porCargo: Record<string, { quantidade: number; folha: number }>;
  lista: {
    id: number;
    nome: string;
    cargo: string;
    salario: number;
    status: string;
    email: string;
    telefone: string;
  }[];
}

export interface RelatorioMateriais {
  total: number;
  totalCriticos: number;
  valorTotalEstoque: number;
  porCategoria: Record<string, { quantidade: number; valor: number }>;
  criticos: {
    id: number;
    nome: string;
    categoria: string;
    quantidade: number;
    estoqueMinimo: number;
    unidade: string;
    fornecedor: string;
  }[];
  lista: {
    id: number;
    nome: string;
    categoria: string;
    unidade: string;
    quantidade: number;
    estoqueMinimo: number;
    valorUnitario: number;
    valorTotal: number;
    fornecedor: string;
    critico: boolean;
  }[];
}

export interface RelatorioEquipamentos {
  total: number;
  porStatus: Record<string, number>;
  porTipo: Record<string, number>;
  lista: {
    id: number;
    nome: string;
    tipo: string;
    marca: string;
    modelo: string;
    placa: string;
    status: string;
    valorHora: number;
  }[];
}

export interface RelatorioObra {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  status: string;
  dataInicio: string;
  dataPrevista: string;
  orcamento: number;
  custoReal: number;
  variacao: number;
  diasRestantes: number | null;
  estourado: boolean;
}

@Injectable({ providedIn: 'root' })
export class RelatoriosService {

  private api = 'https://projeto-final-3-7epi.onrender.com';

  constructor(private http: HttpClient) {}

  financeiro(obraId?: number): Observable<RelatorioFinanceiro> {
    const params = obraId ? `?obraId=${obraId}` : '';
    return this.http.get<RelatorioFinanceiro>(`${this.api}/relatorios/financeiro${params}`);
  }

  funcionarios(): Observable<RelatorioFuncionarios> {
    return this.http.get<RelatorioFuncionarios>(`${this.api}/relatorios/funcionarios`);
  }

  materiais(): Observable<RelatorioMateriais> {
    return this.http.get<RelatorioMateriais>(`${this.api}/relatorios/materiais`);
  }

  equipamentos(): Observable<RelatorioEquipamentos> {
    return this.http.get<RelatorioEquipamentos>(`${this.api}/relatorios/equipamentos`);
  }

  obras(): Observable<RelatorioObra[]> {
    return this.http.get<RelatorioObra[]>(`${this.api}/relatorios/obras`);
  }

}
