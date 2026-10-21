// Funções de JWT usadas pelo back-end (usa a biblioteca "jose").
// O segredo vem do .env: JWT_SECRET (o mesmo valor precisa estar no web/.env.local).

import { SignJWT, jwtVerify } from 'jose';

// Contrato, seção 2.1: o token leva sub (id do usuário) e perfil
export type Perfil = 'personal' | 'aluno';
export type PayloadToken = { sub: string; perfil: Perfil };

// Lê o segredo só na hora de usar, para o ConfigModule já ter carregado o .env
function segredo() {
  const valor = process.env.JWT_SECRET;
  if (!valor) throw new Error('JWT_SECRET nao definido no .env do backend');
  return new TextEncoder().encode(valor);
}

// Gera o token. sub = id do usuário; expira em JWT_EXPIRES_IN (padrão 8h).
export function assinarToken(payload: PayloadToken) {
  return new SignJWT({ perfil: payload.perfil })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? '8h')
    .sign(segredo());
}

// Confere assinatura e validade. Lança erro se o token for inválido ou expirado.
export async function verificarToken(token: string): Promise<PayloadToken> {
  const { payload } = await jwtVerify(token, segredo(), {
    algorithms: ['HS256'],
  });
  if (!payload.sub) throw new Error('Token sem sub');
  if (payload.perfil !== 'personal' && payload.perfil !== 'aluno') {
    throw new Error('Token sem perfil valido');
  }
  return { sub: payload.sub, perfil: payload.perfil };
}
