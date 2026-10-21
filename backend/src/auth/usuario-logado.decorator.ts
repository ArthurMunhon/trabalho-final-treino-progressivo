import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Perfil } from './jwt.js';

export type UsuarioDoToken = { id: string; perfil: Perfil };
export type RequestComUsuario = Request & { usuario?: UsuarioDoToken };

// Uso no controller:  @UsuarioLogado() usuario: UsuarioDoToken
// Devolve o usuário (personal ou aluno) que o JwtAuthGuard leu do token.
export const UsuarioLogado = createParamDecorator(
  (_dado: unknown, contexto: ExecutionContext): UsuarioDoToken => {
    const req = contexto.switchToHttp().getRequest<RequestComUsuario>();
    return req.usuario as UsuarioDoToken;
  },
);

// Uso:  @Perfis('personal') na rota. Sem ele, qualquer perfil logado passa.
// Perfil errado recebe 403 (contrato, seção 2.3).
export const CHAVE_PERFIS = 'perfis';
export const Perfis = (...perfis: Perfil[]) => SetMetadata(CHAVE_PERFIS, perfis);
