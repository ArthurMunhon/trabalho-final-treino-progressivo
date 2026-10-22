import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type PersonalDoToken = { id: string; email: string };
export type RequestComPersonal = Request & { personal?: PersonalDoToken };

// Uso no controller:  @PersonalLogado() personal: PersonalDoToken
// Devolve o personal que o JwtAuthGuard leu do token.
export const PersonalLogado = createParamDecorator(
  (_dado: unknown, contexto: ExecutionContext): PersonalDoToken => {
    const req = contexto.switchToHttp().getRequest<RequestComPersonal>();
    return req.personal as PersonalDoToken;
  },
);
