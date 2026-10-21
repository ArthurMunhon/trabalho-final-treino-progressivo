import "server-only";

export type Exercicio = {
    id: string;
    nome: string;
    grupoMuscular: string;
};

export type Pagina<T> = {
    dados: T[];
    page: number;
    limit: number;
    total: number;
    totalDePaginas: number;
};

export type DadosExercicio = {
    nome: string;
    grupoMuscular: string;
};

export type ResultadoEscrita<T> =
    | { situacao: "gravado"; dado: T }
    | { situacao: "recusado"; status: number; detalhes: string[] };

const API_URL = process.env.API_URL ?? "http://localhost:3001";
export const ETIQUETA_EXERCICIOS = "exercicios";
const VALIDADE_SEGUNDOS = 60;
const ATRASO_MS = Number(process.env.ATRASO_API_MS ?? 0);

function esperar(ms: number): Promise<void> {
    return new Promise((resolver) => setTimeout(resolver, ms));
}

export async function listarExercicios({
                                           page = 1,
                                           limit = 20,
                                           grupoMuscular,
                                       }: {
    page?: number;
    limit?: number;
    grupoMuscular?: string;
}): Promise<Pagina<Exercicio>> {
    await esperar(ATRASO_MS);
    const consulta = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    if (grupoMuscular) consulta.set("grupoMuscular", grupoMuscular);

    const resposta = await fetch(`${API_URL}/exercicios?${consulta}`, {
        next: { revalidate: VALIDADE_SEGUNDOS, tags: [ETIQUETA_EXERCICIOS] },
    });
    if (!resposta.ok) throw new Error(`GET /exercicios respondeu ${resposta.status}`);
    return resposta.json();
}

export async function buscarExercicio(id: string): Promise<Exercicio | undefined> {
    await esperar(ATRASO_MS);
    const resposta = await fetch(`${API_URL}/exercicios/${id}`, {
        next: { revalidate: VALIDADE_SEGUNDOS, tags: [ETIQUETA_EXERCICIOS] },
    });
    if (resposta.status === 404) return undefined;
    if (!resposta.ok) throw new Error(`GET /exercicios/${id} respondeu ${resposta.status}`);
    return resposta.json();
}

export function criarExercicio(dados: DadosExercicio): Promise<ResultadoEscrita<Exercicio>> {
    return enviar("POST", "/exercicios", dados);
}

export function atualizarExercicio(id: string, dados: Partial<DadosExercicio>): Promise<ResultadoEscrita<Exercicio>> {
    return enviar("PATCH", `/exercicios/${id}`, dados);
}

export async function deletarExercicio(id: string): Promise<boolean> {
    await esperar(ATRASO_MS);
    const resposta = await fetch(`${API_URL}/exercicios/${id}`, {
        method: "DELETE",
        cache: "no-store",
    });
    if (resposta.status === 404) return false;
    if (!resposta.ok) throw new Error(`DELETE /exercicios/${id} respondeu ${resposta.status}`);
    return true;
}

async function enviar<T>(
    metodo: "POST" | "PATCH",
    caminho: string,
    dados: unknown
): Promise<ResultadoEscrita<T>> {
    await esperar(ATRASO_MS);
    const resposta = await fetch(`${API_URL}${caminho}`, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(dados),
    });

    if (resposta.ok) {
        return { situacao: "gravado", dado: await resposta.json() };
    }

    if ([400, 401, 403, 404, 409].includes(resposta.status)) {
        const corpo: { detalhes: string[] } = await resposta.json();
        return {
            situacao: "recusado",
            status: resposta.status,
            detalhes: corpo.detalhes ?? ["Erro desconhecido"],
        };
    }

    throw new Error(`${metodo} ${caminho} respondeu ${resposta.status}`);
}