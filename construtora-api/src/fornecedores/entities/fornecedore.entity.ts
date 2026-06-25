import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('fornecedores')
export class Fornecedor {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  cnpj!: string;

  @Column()
  telefone!: string;

  @Column()
  email!: string;

  @Column()
  endereco!: string;

  @Column()
  categoria!: string;

  @Column()
  status!: string;

}