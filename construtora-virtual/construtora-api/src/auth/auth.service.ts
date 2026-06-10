import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService
  ) {}

  login(usuario: any) {

    const payload = {

      sub: usuario.id,

      email: usuario.email,

      perfil: usuario.perfil

    };

    return {

  access_token:
    this.jwtService.sign(payload),

  usuario: {

    id: usuario.id,

    nome: usuario.nome,

    email: usuario.email,

    perfil: usuario.perfil

  }

};
}
}