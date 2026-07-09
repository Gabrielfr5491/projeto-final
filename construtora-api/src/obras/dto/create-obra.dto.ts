export class CreateObraDto {

  nome!: string;

  endereco!: string;

  cidade!: string;

  estado!: string;

  dataInicio!: string;

  dataPrevista!: string;

  status!: string;

  orcamento!: number;

  modelo3dBase64?: string;
  modelo3dNome?: string;
  modelo3dFormato?: string;
  mapaEletricistaBase64?: string;
  mapaEletricistaNome?: string;
  pdfClausulasBase64?: string;
  pdfClausulasNome?: string;

}