export class CreateModelo3dDto {
  obraId?: number;
  nome!: string;
  formato!: string;
  modeloBase64?: string;
  anotacoes?: any[];
  medicoes?: any[];
  iluminacao?: any;
  modoRenderizacao?: string;
}
