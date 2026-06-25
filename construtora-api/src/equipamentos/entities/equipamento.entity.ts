import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('equipamentos')
export class Equipamento {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  tipo!: string;

  @Column()
  marca!: string;

  @Column()
  modelo!: string;

  @Column()
  placa!: string;

  @Column()
  status!: string;

  @Column('decimal')
  valorHora!: number;

}