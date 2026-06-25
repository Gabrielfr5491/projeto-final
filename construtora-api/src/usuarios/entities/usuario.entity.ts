import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('usuarios')
export class Usuario {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({
    unique: true
  })
  email!: string;

  @Column()
  senha!: string;

  @Column()
  perfil!: string;

}