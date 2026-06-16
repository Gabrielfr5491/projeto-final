import { Obra } from './obra';

export interface Custo {

  id?: number;

  descricao: string;

  categoria: string;

  valor: number;

  data: string;

  tipo: string;

  obraId: number;

  obra?: Obra;

}