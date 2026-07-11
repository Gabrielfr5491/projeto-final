import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const perfisExigidos = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers['authorization'] ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) throw new UnauthorizedException('Token não fornecido.');

    let payload: any;
    try {
      payload = this.jwtService.verify(token, { secret: 'CONSTRUTORA_SECRET' });
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    if (!perfisExigidos || perfisExigidos.length === 0) return true;

    const perfil = (payload.perfil ?? '').toLowerCase();
    if (perfisExigidos.includes(perfil)) return true;

    throw new ForbiddenException('Você não tem permissão para realizar esta ação.');
  }
}
