import {
  Controller,
  Post,
  Body,
  UnauthorizedException
} from '@nestjs/common';

import { AuthService }
from './auth.service';

import { UsuariosService }
from '../usuarios/usuarios.service';

import { LoginDto }
from './dto/login.dto';

@Controller('auth')
export class AuthController {

  constructor(

    private authService:
    AuthService,

    private usuariosService:
    UsuariosService

  ) {}

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto
  ) {

    const usuario =

      await this.usuariosService
      .buscarPorEmail(
        loginDto.email
      );

    if (
      !usuario ||
      usuario.senha !==
      loginDto.senha
    ) {

      throw new
      UnauthorizedException(
        'Credenciais inválidas'
      );

    }

    return this.authService
      .login(usuario);

  }

}