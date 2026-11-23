import "server-only";
import { chamarApi, lerErro } from "@/lib/api";

// lib/solicitacoes.ts
// Pedidos de alunos que querem ser atendidos pelo personal logado.

export type Solicitacao = {
    id: string;
    createdAt: string;
    aluno: { id: string; nome: string; email: string };
};

export async function listarSolicitacoes(): Promise<Solicitacao[]> {
    const resposta = await chamarApi("/solicitacoes");
    if (!resposta.ok) throw new Error(await lerErro(resposta));
    return resposta.json();
}

export async function aceitarSolicitacao(id: string): Promise<void> {
    const resposta = await chamarApi(`/solicitacoes/${id}/aceitar`, { method: "POST" });
    if (!resposta.ok) throw new Error(await lerErro(resposta));
}

export async function recusarSolicitacao(id: string): Promise<void> {
    const resposta = await chamarApi(`/solicitacoes/${id}`, { method: "DELETE" });
    if (!resposta.ok) throw new Error(await lerErro(resposta));
}