import "server-only";

const API_URL = "http://localhost:3001";

export async function listarSessoes(p: {}) {
    const res = await fetch(`${API_URL}/sessoes-treino`, {
        next: { tags: ["sessoes-treino"] },
    });

    if (!res.ok) {
        throw new Error(`Erro ao buscar sessões de treino: ${res.statusText}`);
    }

    return res.json();
}