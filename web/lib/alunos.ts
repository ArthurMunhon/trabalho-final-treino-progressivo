import "server-only";
import { lerToken } from "@/lib/sessao";

// ---------- Tipos ----------
export type Aluno = {
    id: string;
    nome: string;
    email: string;
};

export type DadosAluno = {
    nome: string;
    email: string;
    senha: string;
};

export type Pagina<T> = {
    dados: T[];
    page: number;
    limit: number;
    total: number;
    totalDePaginas: number;
};

const API_URL = process.env.API_URL ?? "http://localhost:3001";

// ---------- Função auxiliar ----------
// Faz a chamada à API e lança erro se algo der errado.
// cache: "no-store" = sempre busca dados novos (mais simples, sem cache).
// O token do cookie vai no header: a API só devolve os alunos do personal logado.
async function chamarApi(caminho: string, opcoes: RequestInit = {}) {
    const token = await lerToken();
    const resposta = await fetch(`${API_URL}${caminho}`, {
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(5000), // desiste depois de 5 segundos
        ...opcoes,
    });
    return resposta;
}

// ---------- Funções ----------
export async function listarAlunos(
    { page = 1, limit = 20, busca = "" } = {}
): Promise<Pagina<Aluno>> {
    const consulta = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (busca) consulta.set("busca", busca);

    const resposta = await chamarApi(`/alunos?${consulta}`);
    if (!resposta.ok) throw new Error(`Erro ao listar alunos (${resposta.status})`);
    return resposta.json();
}

export async function buscarAluno(id: string): Promise<Aluno | undefined> {
    const resposta = await chamarApi(`/alunos/${id}`);
    if (resposta.status === 404) return undefined;
    if (!resposta.ok) throw new Error(`Erro ao buscar aluno (${resposta.status})`);
    return resposta.json();
}

export async function criarAluno(dados: DadosAluno): Promise<Aluno> {
    const resposta = await chamarApi("/alunos", {
        method: "POST",
        body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw new Error(`Erro ao criar aluno (${resposta.status})`);
    return resposta.json();
}

export async function atualizarAluno(
    id: string,
    dados: Partial<DadosAluno>
): Promise<Aluno> {
    const resposta = await chamarApi(`/alunos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw new Error(`Erro ao atualizar aluno (${resposta.status})`);
    return resposta.json();
}

export async function deletarAluno(id: string): Promise<boolean> {
    const resposta = await chamarApi(`/alunos/${id}`, { method: "DELETE" });
    if (resposta.status === 404) return false;
    if (!resposta.ok) throw new Error(`Erro ao deletar aluno (${resposta.status})`);
    return true;
}