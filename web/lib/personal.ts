"use server"; // as funções abaixo rodam no servidor e podem ser chamadas pelas páginas

// lib/personal.ts
// Login, cadastro e logout do personal. Falam com o back-end e guardam o token
// num cookie (só o servidor consegue gravar cookie, por isso o "use server").

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL ?? "http://localhost:3001";
const OITO_HORAS = 60 * 60 * 8; // em segundos

// Grava o token e o nome nos cookies (não é exportada de propósito)
async function guardarSessao(accessToken: string, nome: string) {
    const jar = await cookies();
    jar.set("token", accessToken, {
        httpOnly: true, // o JavaScript do navegador não consegue ler o token
        sameSite: "lax",
        path: "/",
        maxAge: OITO_HORAS,
        secure: process.env.NODE_ENV === "production",
    });
    // O nome é só para mostrar "Olá, fulano" no dashboard
    jar.set("nome", nome, { httpOnly: true, sameSite: "lax", path: "/", maxAge: OITO_HORAS });
}

// Chama o back-end. Devolve { dados } se deu certo ou { erro } se não.
async function chamarPersonal(caminho: "login" | "register", corpo: object) {
    try {
        const res = await fetch(`${API_URL}/personal/${caminho}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo),
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });
        const json = await res.json().catch(() => null);

        if (!res.ok) {
            const msg = Array.isArray(json?.message) ? json.message.join(", ") : json?.message;
            return { erro: (msg as string) ?? "Não foi possível concluir" };
        }
        return { dados: json };
    } catch {
        return { erro: "Servidor indisponível. Tente novamente." };
    }
}

export async function login(email: string, senha: string): Promise<{ erro: string } | undefined> {
    const r = await chamarPersonal("login", { email, senha });
    if (r.erro) return { erro: r.erro };

    await guardarSessao(r.dados.accessToken, r.dados.personal.nome);
    redirect("/dashboard"); // só chega aqui se deu certo
}

export async function register(
    nome: string,
    email: string,
    senha: string,
): Promise<{ erro: string } | undefined> {
    const r = await chamarPersonal("register", { nome, email, senha });
    if (r.erro) return { erro: r.erro };

    await guardarSessao(r.dados.accessToken, r.dados.personal.nome);
    redirect("/dashboard"); // conta criada = já fica logado
}

export async function logout() {
    const jar = await cookies();
    jar.delete("token");
    jar.delete("nome");
    redirect("/");
}