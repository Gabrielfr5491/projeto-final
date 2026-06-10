import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('funcionarios')
export class Funcionario {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  cpf!: string;

  @Column()
  cargo!: string;

  @Column('decimal')
  salario!: number;

  @Column()
  telefone!: string;

  @Column()
  email!: string;

  @Column()
  status!: string;

}