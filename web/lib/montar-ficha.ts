import "server-only";
import { chamarApi, lerErro, personalIdDoToken } from "@/lib/api";
import type { FichaParaSalvar, ResultadoSalvar } from "@/lib/tipos-ficha";

// lib/montar-ficha.ts
// Cria a ficha no back-end: primeiro a ficha, depois cada exercício (item).
// Se algum item falhar, apaga a ficha para não ficar uma ficha pela metade.

// Se o seu back-end já pega o personal pelo token, troque para false.
const ENVIAR_PERSONAL_ID = true;

export async function criarFichaComItens(dados: FichaParaSalvar): Promise<ResultadoSalvar> {
    // 1) Cria a ficha vazia
    const corpo: Record<string, string> = { alunoId: dados.alunoId };
    if (ENVIAR_PERSONAL_ID) {
        const personalId = await personalIdDoToken();
        if (!personalId) return { ok: false, erro: "Sessão inválida. Entre novamente." };
        corpo.personalId = personalId;
    }

    const resFicha = await chamarApi("/fichas", {
        method: "POST",
        body: JSON.stringify(corpo),
    });
    if (!resFicha.ok) return { ok: false, erro: await lerErro(resFicha) };
    const ficha: { id: string } = await resFicha.json();

    // 2) Adiciona os exercícios, na ordem em que estão na tela
    for (const [indice, item] of dados.itens.entries()) {
        const resItem = await chamarApi(`/fichas/${ficha.id}/itens`, {
            method: "POST",
            body: JSON.stringify({ ...item, ordem: indice + 1 }),
        });

        if (!resItem.ok) {
            const erro = await lerErro(resItem);
            // Desfaz: apaga a ficha criada
            await chamarApi(`/fichas/${ficha.id}`, { method: "DELETE" });
            return { ok: false, erro: `Exercício ${indice + 1}: ${erro}` };
        }
    }

    return { ok: true };
}