import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Obra } from '../../obras/entities/obra.entity';

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
  tipo!: string;

  @Column()
  obraId!: number;

  // eager removido: evita JOIN automático com campos base64 da Obra em todo find()
  @ManyToOne(() => Obra)
  @JoinColumn({ name: 'obraId' })
  obra!: Obra;

}