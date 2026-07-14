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

  /**
   * Redefine a senha de uma conta existente.
   * Use apenas para recuperar acesso — não expõe dados, só altera senha se o e-mail existir.
   */
  @Post('reset-senha')
  async resetSenha(
    @Body() body: { email: string; novaSenha: string }
  ) {
    const usuario = await this.usuariosService.buscarPorEmail(body.email);
    if (!usuario) {
      // Resposta genérica para não revelar se o e-mail existe
      return { message: 'Se este e-mail estiver cadastrado, a senha foi atualizada.' };
    }
    await this.usuariosService.update(usuario.id, { senha: body.novaSenha } as any);
    return { message: 'Senha atualizada com sucesso. Faça login com a nova senha.' };
  }

  /**
   * Registro público — qualquer visitante pode criar uma conta.
   * Toda conta criada por aqui recebe perfil 'admin' automaticamente.
   */
  @Post('registro')
  async registro(
    @Body() body: { nome: string; email: string; senha: string }
  ) {
    const existe = await this.usuariosService.buscarPorEmail(body.email);
    if (existe) {
      throw new UnauthorizedException('Este e-mail já está cadastrado.');
    }

    const novoUsuario = await this.usuariosService.create({
      nome:   body.nome,
      email:  body.email,
      senha:  body.senha,
      perfil: 'admin' as any,
    });

    return this.authService.login(novoUsuario);
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
      nome:   body.nome,
      email:  body.email,
      senha:  body.senha,
      perfil: 'admin' as any,
    });

    return this.authService.login(novoAdmin);
  }

}