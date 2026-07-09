import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('modelos_3d')
export class Modelo3d {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  obraId!: number;

  @Column()
  nome!: string;

  @Column()
  formato!: string; // obj | stl | fbx | gltf

  @Column({ type: 'text', nullable: true })
  modeloBase64!: string; // conteúdo do arquivo em Base64

  @Column({ type: 'jsonb', default: '[]' })
  anotacoes!: any[];

  @Column({ type: 'jsonb', default: '[]' })
  medicoes!: any[];

  @Column({ type: 'jsonb', nullable: true })
  iluminacao!: any;

  @Column({ default: 'textured' })
  modoRenderizacao!: string;

  @CreateDateColumn()
  criadoEm!: Date;

  @UpdateDateColumn()
  atualizadoEm!: Date;
}
