import "server-only";
import { chamarApi, lerErro } from "@/lib/api";

// app/fichas/fichas.ts
// Busca as fichas já criadas de um aluno (com os exercícios de cada uma).

export type ItemSalvo = {
    id: string;
    ordem: number;
    tipo?: "forca" | "cardio";
    nomePersonalizado: string | null;
    exercicio: { nome: string } | null; // null quando é personalizado
    seriesAlvo: number | null;
    repeticoesAlvo: number | null;
    cargaSugerida: number | null;
    duracaoMin: number | null;
    velocidadeKmh: number | null;
    inclinacaoPct: number | null;
};

export type FichaSalva = {
    id: string;
    createdAt: string;
    itens: ItemSalvo[];
};

// O back-end devolve da mais antiga para a mais nova
export async function listarFichasDoAluno(alunoId: string): Promise<FichaSalva[]> {
    const consulta = new URLSearchParams({ alunoId, limit: "50" });
    const resposta = await chamarApi(`/fichas?${consulta}`);
    if (!resposta.ok) throw new Error(await lerErro(resposta));
    const corpo = await resposta.json();
    return corpo.dados;
}

// Exclui a ficha (e os itens dela) no banco
export async function deletarFicha(id: string): Promise<void> {
    const resposta = await chamarApi(`/fichas/${id}`, { method: "DELETE" });
    if (!resposta.ok) throw new Error(await lerErro(resposta));
}