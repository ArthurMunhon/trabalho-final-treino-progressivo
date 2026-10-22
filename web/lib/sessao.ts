import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Sessão do personal no web.
// O token JWT fica num cookie httpOnly: o JavaScript da página não consegue lê-lo,
// só o servidor do Next (via cookies()), que repassa para a API no header Authorization.

export const COOKIE_SESSAO = "fittrack_token";

// Mesmo tempo de validade do JWT no backend (JWT_EXPIRES_IN, padrão 8h)
export const DURACAO_SESSAO = 8 * 60 * 60;

export const API_URL = process.env.API_URL ?? "http://localhost:3001";

export type Usuario = {
    id: string;
    nome: string;
    email: string;
};

// ---------- Funções ----------
export async function lerToken(): Promise<string | undefined> {
    return (await cookies()).get(COOKIE_SESSAO)?.value;
}

// Pergunta à API quem é o dono do token (GET /personal/me, contrato 1.2).
// Quem confere assinatura e validade é a API, não o front.
// cache: o layout e a página usam o mesmo resultado numa renderização.
export const obterUsuario = cache(async (): Promise<Usuario | null> => {
    const token = await lerToken();
    if (!token) return null;

    const resposta = await fetch(`${API_URL}/personal/me`, {
        cache: "no-store", // nunca compartilhar a identidade entre usuários
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000),
    });
    // 401 = token inválido ou expirado; 403 = token de aluno
    if (resposta.status === 401 || resposta.status === 403) return null;
    if (!resposta.ok) throw new Error(`Erro ao buscar usuario (${resposta.status})`);
    return resposta.json();
});

// Uso no início de cada página protegida: sem login, vai para /login.
export async function exigirUsuario(): Promise<Usuario> {
    const usuario = await obterUsuario();
    if (!usuario) redirect("/login");
    return usuario;
}
