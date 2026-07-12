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

  /** Cria o primeiro admin do sistema — só funciona se não existir nenhum admin ainda */
  @Post('seed-admin')
  async seedAdmin(
    @Body() body: { nome: string; email: string; senha: string }
  ) {
    const existe = await this.usuariosService.buscarPorEmail(body.email);
    if (existe) {
      throw new UnauthorizedException('Usuário já existe.');
    }

    const admins = await this.usuariosService.contarAdmins();
    if (admins > 0) {
      throw new UnauthorizedException('Já existe um administrador cadastrado. Use o login normal.');
    }

    const novoAdmin = await this.usuariosService.create({
      nome: body.nome,
      email: body.email,
      senha: body.senha,
      perfil: 'admin' as any,
    });

    return this.authService.login(novoAdmin);
  }

}