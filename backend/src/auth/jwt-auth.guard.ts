import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verificarToken } from './jwt.js';
import type { RequestComPersonal } from '../personal/personal-logado.decorator.js';

// Guard: só deixa passar quem manda "Authorization: Bearer <token>" válido.
// Uso:  @UseGuards(JwtAuthGuard) no controller ou na rota.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const req = contexto.switchToHttp().getRequest<RequestComPersonal>();
    const [tipo, token] = req.headers.authorization?.split(' ') ?? [];

    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token ausente');
    }

    try {
      const payload = await verificarToken(token);
      req.personal = { id: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException('Token invalido ou expirado');
    }
  }
}
