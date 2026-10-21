import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verificarToken, type Perfil } from './jwt.js';
import {
  CHAVE_PERFIS,
  type RequestComUsuario,
} from './usuario-logado.decorator.js';

// Guard: só deixa passar quem manda "Authorization: Bearer <token>" válido.
// Uso:  @UseGuards(JwtAuthGuard) no controller ou na rota,
//       mais @Perfis('personal') se a rota for de um perfil só.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const req = contexto.switchToHttp().getRequest<RequestComUsuario>();
    const [tipo, token] = req.headers.authorization?.split(' ') ?? [];

    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token ausente');
    }

    let payload;
    try {
      payload = await verificarToken(token);
    } catch {
      throw new UnauthorizedException('Token invalido ou expirado');
    }
    req.usuario = { id: payload.sub, perfil: payload.perfil };

    const perfis = this.reflector.getAllAndOverride<Perfil[] | undefined>(
      CHAVE_PERFIS,
      [contexto.getHandler(), contexto.getClass()],
    );
    if (perfis && !perfis.includes(payload.perfil)) {
      throw new ForbiddenException('Perfil sem permissao para esta operacao');
    }
    return true;
  }
}
