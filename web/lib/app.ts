// Acesso à API do backend NestJS (treino progressivo).
// O navegador chama a API diretamente — é para isso que o main.ts do
// backend já libera CORS (CORS_ORIGIN aponta para este site).

export type Aluno = {
    id: string;
    nome: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};

export type CriarAlunoInput = {
    nome: string;
    email: string;
    senha: string;
};

// process.env só chega no navegador se a variável começar com NEXT_PUBLIC_.
// Crie web/.env.local com: NEXT_PUBLIC_API_URL=http://localhost:3000
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function requisitar<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
    const resposta = await fetch(`${API_URL}${caminho}`, {
        headers: { "Content-Type": "application/json" },
        ...opcoes,
    });

    if (!resposta.ok) {
        // o FiltroDeExcecoes do backend devolve { detalhes: string[] }
        const corpo = await resposta.json().catch(() => null);
        const mensagem = corpo?.detalhes?.[0] ?? `Erro ${resposta.status}`;
        throw new Error(mensagem);
    }

    // DELETE (204) não tem corpo para parsear
    if (resposta.status === 204) return undefined as T;

    return resposta.json();
}

export async function listarAlunos(): Promise<Aluno[]> {
    return requisitar<Aluno[]>("/alunos");
}

export async function buscarAluno(id: string): Promise<Aluno | undefined> {
    try {
        return await requisitar<Aluno>(`/alunos/${id}`);
    } catch {
        return undefined;
    }
}

export async function criarAluno(dados: CriarAlunoInput): Promise<Aluno> {
    return requisitar<Aluno>("/alunos", {
        method: "POST",
        body: JSON.stringify(dados),
    });
}

// TODO: não existe cadastro nem login de Personal no backend ainda —
//   só o model Personal no schema.prisma, sem controller/service.
//   As páginas login/page.tsx e cadastro/page.tsx chamam /api/auth/login
//   e /api/auth/register, que também não existem. Isso trava o fluxo de
//   personal até esse módulo ser criado no backend.