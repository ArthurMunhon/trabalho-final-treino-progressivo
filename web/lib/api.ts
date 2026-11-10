import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// lib/api.ts
// Função única para falar com o back-end mandando o token do cookie.

export const API_URL = process.env.API_URL ?? "http://localhost:3001";

// Lê o token do cookie (gravado no login) e manda em Authorization.
// Se o back-end responder 401 (sem token / expirado), volta para o login.
export async function chamarApi(caminho: string, opcoes: RequestInit = {}) {
    const token = (await cookies()).get("token")?.value;

    const resposta = await fetch(`${API_URL}${caminho}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000), // desiste depois de 5 segundos
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (resposta.status === 401) redirect("/login");
    return resposta;
}

// Extrai a mensagem de erro do back-end (Nest manda "message" como texto ou lista)
export async function lerErro(resposta: Response): Promise<string> {
    const corpo = await resposta.json().catch(() => null);
    const msg = corpo?.message ?? corpo?.detalhes;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
    return `Erro ${resposta.status}`;
}

// Lê o id do personal de dentro do token (só leitura, sem validar:
// quem valida o token de verdade é o back-end).
export async function personalIdDoToken(): Promise<string | undefined> {
    const token = (await cookies()).get("token")?.value;
    if (!token) return undefined;
    try {
        const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
        );
        return typeof payload.sub === "string" ? payload.sub : undefined;
    } catch {
        return undefined;
    }
}