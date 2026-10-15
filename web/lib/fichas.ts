import "server-only";

export type ItemFicha = {
    id: string;
    exercicioId: string;
    ordem: number;
    seriesAlvo: number;
    repeticoesAlvo: number;
    cargaSugerida: number;
};

export type Ficha = {
    id: string;
    alunoId: string;
    personalId: string;
    itens: ItemFicha[];
};

export type Pagina<T> = {
    dados: T[];
    page: number;
    limit: number;
    total: number;
    totalDePaginas: number;
};

export type DadosCriarItem = {
    exercicioId: string;
    ordem: number;
    seriesAlvo: number;
    repeticoesAlvo: number;
    cargaSugerida: number;
};

export type DadosCriarFicha = {
    alunoId: string;
    personalId: string;
    itens: DadosCriarItem[];
};

export type ResultadoEscrita<T> =
    | { situacao: "gravado"; dado: T }
    | { situacao: "recusado"; status: number; detalhes: string[] };

const API_URL = process.env.API_URL ?? "http://localhost:3000";
export const ETIQUETA_FICHAS = "fichas";
const VALIDADE_SEGUNDOS = 60;
const ATRASO_MS = Number(process.env.ATRASO_API_MS ?? 0);

function esperar(ms: number): Promise<void> {
    return new Promise((resolver) => setTimeout(resolver, ms));
}

export async function listarFichas({
                                       page = 1,
                                       limit = 20,
                                       alunoId,
                                   }: {
    page?: number;
    limit?: number;
    alunoId?: string;
}): Promise<Pagina<Ficha>> {
    await esperar(ATRASO_MS);
    const consulta = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    if (alunoId) consulta.set("alunoId", alunoId);

    const resposta = await fetch(`${API_URL}/fichas?${consulta}`, {
        next: { revalidate: VALIDADE_SEGUNDOS, tags: [ETIQUETA_FICHAS] },
    });
    if (!resposta.ok) throw new Error(`GET /fichas respondeu ${resposta.status}`);
    return resposta.json();
}

export async function buscarFicha(id: string): Promise<Ficha | undefined> {
    await esperar(ATRASO_MS);
    const resposta = await fetch(`${API_URL}/fichas/${id}`, {
        next: { revalidate: VALIDADE_SEGUNDOS, tags: [ETIQUETA_FICHAS] },
    });
    if (resposta.status === 404) return undefined;
    if (!resposta.ok) throw new Error(`GET /fichas/${id} respondeu ${resposta.status}`);
    return resposta.json();
}

export function criarFicha(dados: DadosCriarFicha): Promise<ResultadoEscrita<Ficha>> {
    return enviar("POST", "/fichas", dados);
}

export function atualizarFicha(id: string, dados: { alunoId?: string }): Promise<ResultadoEscrita<Ficha>> {
    return enviar("PATCH", `/fichas/${id}`, dados);
}

export async function deletarFicha(id: string): Promise<boolean> {
    await esperar(ATRASO_MS);
    const resposta = await fetch(`${API_URL}/fichas/${id}`, {
        method: "DELETE",
        cache: "no-store",
    });
    if (resposta.status === 404) return false;
    if (!resposta.ok) throw new Error(`DELETE /fichas/${id} respondeu ${resposta.status}`);
    return true;
}

export function adicionarItemFicha(fichaId: string, dados: DadosCriarItem): Promise<ResultadoEscrita<ItemFicha>> {
    return enviar("POST", `/fichas/${fichaId}/itens`, dados);
}

export function atualizarItemFicha(itemFichaId: string, dados: { cargaSugerida?: number }): Promise<ResultadoEscrita<ItemFicha>> {
    return enviar("PATCH", `/itens-ficha/${itemFichaId}`, dados);
}

export async function deletarItemFicha(itemFichaId: string): Promise<boolean> {
    await esperar(ATRASO_MS);
    const resposta = await fetch(`${API_URL}/itens-ficha/${itemFichaId}`, {
        method: "DELETE",
        cache: "no-store",
    });
    if (resposta.status === 404) return false;
    if (!resposta.ok) throw new Error(`DELETE /itens-ficha/${itemFichaId} respondeu ${resposta.status}`);
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
        if (resposta.status === 204) return { situacao: "gravado", dado: {} as T };
        const text = await resposta.text();
        return { situacao: "gravado", dado: text ? JSON.parse(text) : ({} as T) };
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