import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('obras')
export class Obra {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  endereco!: string;

  @Column()
  cidade!: string;

  @Column()
  estado!: string;

  @Column()
  dataInicio!: string;

  @Column()
  dataPrevista!: string;

  @Column()
  status!: string;

  @Column('decimal')
  orcamento!: number;

  @Column({ type: 'text', nullable: true })
  modelo3dBase64!: string;

  @Column({ nullable: true })
  modelo3dNome!: string;

  @Column({ nullable: true })
  modelo3dFormato!: string;

  @Column({ type: 'text', nullable: true })
  mapaEletricistaBase64!: string;

  @Column({ nullable: true })
  mapaEletricistaNome!: string;

  @Column({ type: 'text', nullable: true })
  pdfClausulasBase64!: string;

  @Column({ nullable: true })
  pdfClausulasNome!: string;
}