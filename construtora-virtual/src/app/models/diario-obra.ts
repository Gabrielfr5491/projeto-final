export interface DiarioEntrada {
  id?: number;
  obraId: number;
  titulo: string;
  descricao: string;
  data: string;
  autor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiarioObra {
  obraId: number;
  obraNome: string;
  entradas: DiarioEntrada[];
}
