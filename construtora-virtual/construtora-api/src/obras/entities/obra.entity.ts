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
}