"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL, COOKIE_SESSAO, DURACAO_SESSAO } from "@/lib/sessao";

// Server Actions de sessão: rodam só no servidor, então o token nunca
// passa pelo JavaScript do navegador.

export type EstadoFormulario = {
    mensagem: string;
    email: string;
};

// Resposta do login e do cadastro: { accessToken, usuario: { id, nome, perfil } }
type RespostaAuth = {
    accessToken: string;
    usuario: { id: string; nome: string; perfil: "personal" | "aluno" };
};

async function gravarSessao(token: string) {
    (await cookies()).set(COOKIE_SESSAO, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: DURACAO_SESSAO,
    });
}

async function chamarAuth(caminho: string, corpo: object) {
    try {
        return await fetch(`${API_URL}${caminho}`, {
            method: "POST",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo),
            signal: AbortSignal.timeout(5000),
        });
    } catch {
        return null; // API fora do ar ou demorou demais
    }
}

export async function entrar(
    _anterior: EstadoFormulario,
    formData: FormData
): Promise<EstadoFormulario> {
    const email = String(formData.get("email") ?? "");
    const senha = String(formData.get("senha") ?? "");

    const resposta = await chamarAuth("/auth/login", { email, senha });
    if (!resposta) return { email, mensagem: "Servico indisponivel. Tente novamente." };
    if (resposta.status === 401) return { email, mensagem: "Email ou senha invalidos." };
    if (resposta.status === 400) return { email, mensagem: "Confira o formato do email e da senha." };
    if (!resposta.ok) return { email, mensagem: "Servico indisponivel. Tente novamente." };

    const dados: RespostaAuth = await resposta.json();

    // O site é só do personal; o aluno entra pelo app mobile
    if (dados.usuario.perfil !== "personal") {
        return { email, mensagem: "Alunos acessam pelo aplicativo mobile." };
    }

    await gravarSessao(dados.accessToken);
    redirect("/dashboard"); // fora de try/catch: o redirect funciona lançando um erro
}

export async function cadastrar(
    _anterior: EstadoFormulario,
    formData: FormData
): Promise<EstadoFormulario> {
    const nome = String(formData.get("nome") ?? "");
    const email = String(formData.get("email") ?? "");
    const senha = String(formData.get("senha") ?? "");

    const resposta = await chamarAuth("/auth/register", { nome, email, senha });
    if (!resposta) return { email, mensagem: "Servico indisponivel. Tente novamente." };
    if (resposta.status === 409) return { email, mensagem: "Ja existe uma conta com esse email." };
    if (resposta.status === 400) return { email, mensagem: "Confira os dados: senha com no minimo 6 caracteres." };
    if (!resposta.ok) return { email, mensagem: "Nao foi possivel criar a conta." };

    const dados: RespostaAuth = await resposta.json();
    await gravarSessao(dados.accessToken);
    redirect("/dashboard");
}

// Logout: apaga o cookie. O JWT em si continua válido até expirar.
export async function sair() {
    (await cookies()).delete(COOKIE_SESSAO);
    redirect("/login");
}
