import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('materiais')
export class Material {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  categoria!: string;

  @Column()
  unidade!: string;

  @Column('decimal')
  valorUnitario!: number;

  @Column()
  quantidade!: number;

  @Column()
  estoqueMinimo!: number;

  @Column()
  fornecedor!: string;

}