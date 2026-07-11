import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Perfil {
  ADMIN    = 'admin',
  GERENTE  = 'gerente',
  COMUM    = 'comum',
}

@Entity('usuarios')
export class Usuario {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  senha!: string;

  @Column({ default: Perfil.COMUM })
  perfil!: string;

}
