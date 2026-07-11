import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { Obra } from '../../obras/entities/obra.entity';

@Entity('diario_entradas')
export class DiarioEntrada {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column('text')
  descricao!: string;

  @Column()
  data!: string;

  @Column({ nullable: true })
  autor!: string;

  @Column()
  obraId!: number;

  @ManyToOne(
    () => Obra,
    { eager: true }
  )
  @JoinColumn({
    name: 'obraId'
  })
  obra!: Obra;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}
