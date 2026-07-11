import { Perfil } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  nome!: string;
  email!: string;
  senha!: string;
  perfil?: Perfil;
}
