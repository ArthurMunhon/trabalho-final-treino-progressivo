import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// lib/exercicios.ts
// O catálogo de exercícios é FIXO e só de leitura: o personal escolhe, não cria.
// (As funções de criar/editar/apagar foram removidas de propósito.)

export type Exercicio = {
    id: string;
    nome: string;
    grupoMuscular: string;
    tipo?: "forca" | "cardio"; // cardio = tempo/velocidade/inclinação (pode não vir ainda)
};

export type Pagina<T> = {
    dados: T[];
    page: number;
    limit: number;
    total: number;
    totalDePaginas: number;
};

// Atenção: o padrão agora é 3001 (o back-end). O 3000 é o próprio Next.
const API_URL = process.env.API_URL ?? "http://localhost:3001";
export const ETIQUETA_EXERCICIOS = "exercicios";
const VALIDADE_SEGUNDOS = 60; // o catálogo quase não muda, então pode ficar em cache
const ATRASO_MS = Number(process.env.ATRASO_API_MS ?? 0);

function esperar(ms: number): Promise<void> {
    return new Promise((resolver) => setTimeout(resolver, ms));
}

// Faz o GET mandando o token do cookie
async function pedir(caminho: string): Promise<Response> {
    await esperar(ATRASO_MS);
    const token = (await cookies()).get("token")?.value;

    const resposta = await fetch(`${API_URL}${caminho}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: VALIDADE_SEGUNDOS, tags: [ETIQUETA_EXERCICIOS] },
    });

    if (resposta.status === 401) redirect("/login");
    return resposta;
}

export async function listarExercicios({
                                           page = 1,
                                           limit = 100,
                                           grupoMuscular,
                                       }: {
    page?: number;
    limit?: number;
    grupoMuscular?: string;
} = {}): Promise<Pagina<Exercicio>> {
    const consulta = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    if (grupoMuscular) consulta.set("grupoMuscular", grupoMuscular);

    const resposta = await pedir(`/exercicios?${consulta}`);
    if (!resposta.ok) throw new Error(`GET /exercicios respondeu ${resposta.status}`);
    return resposta.json();
}

export async function buscarExercicio(id: string): Promise<Exercicio | undefined> {
    const resposta = await pedir(`/exercicios/${id}`);
    if (resposta.status === 404) return undefined;
    if (!resposta.ok) throw new Error(`GET /exercicios/${id} respondeu ${resposta.status}`);
    return resposta.json();
}