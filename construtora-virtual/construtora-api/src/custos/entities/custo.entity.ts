import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('custos')
export class Custo {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  descricao!: string;

  @Column()
  categoria!: string;

  @Column('decimal')
  valor!: number;

  @Column()
  data!: string;

  @Column()
  obra!: string;

  @Column()
  tipo!: string;

}