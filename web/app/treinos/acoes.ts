"use server";

import { revalidatePath } from "next/cache";
import { criarFichaComItens } from "@/lib/montar-ficha";
import type { FichaParaSalvar, ResultadoSalvar } from "@/lib/tipos-ficha";

// app/treinos/actions.ts
// Server Action chamada pelo botão "Salvar ficha".
// O navegador pode mandar qualquer coisa, então TUDO é validado de novo aqui.

function inteiroEntre(valor: unknown, min: number, max: number): valor is number {
    return typeof valor === "number" && Number.isInteger(valor) && valor >= min && valor <= max;
}

export async function salvarFicha(dados: FichaParaSalvar): Promise<ResultadoSalvar> {
    if (typeof dados?.alunoId !== "string" || dados.alunoId === "") {
        return { ok: false, erro: "Escolha o aluno." };
    }
    if (!Array.isArray(dados.itens) || dados.itens.length < 1 || dados.itens.length > 30) {
        return { ok: false, erro: "A ficha precisa ter de 1 a 30 exercícios." };
    }

    // Monta uma cópia limpa: só os campos esperados
    const itens: FichaParaSalvar["itens"] = [];
    for (const [i, item] of dados.itens.entries()) {
        const posicao = i + 1;
        const nome = typeof item.nomePersonalizado === "string" ? item.nomePersonalizado.trim() : "";
        const idCatalogo = typeof item.exercicioId === "string" ? item.exercicioId : "";

        // Ou catálogo ou personalizado, nunca os dois e nunca nenhum
        if ((idCatalogo === "") === (nome === "")) {
            return { ok: false, erro: `Exercício ${posicao}: informe um da lista OU um nome personalizado.` };
        }
        if (nome.length > 80) {
            return { ok: false, erro: `Exercício ${posicao}: nome muito longo (máx. 80).` };
        }
        if (!inteiroEntre(item.seriesAlvo, 1, 20)) {
            return { ok: false, erro: `Exercício ${posicao}: séries devem ser de 1 a 20.` };
        }
        if (!inteiroEntre(item.repeticoesAlvo, 1, 100)) {
            return { ok: false, erro: `Exercício ${posicao}: repetições devem ser de 1 a 100.` };
        }
        if (typeof item.cargaSugerida !== "number" || !(item.cargaSugerida >= 0 && item.cargaSugerida <= 1000)) {
            return { ok: false, erro: `Exercício ${posicao}: carga deve ser de 0 a 1000 kg.` };
        }

        itens.push({
            ...(idCatalogo ? { exercicioId: idCatalogo } : { nomePersonalizado: nome }),
            seriesAlvo: item.seriesAlvo,
            repeticoesAlvo: item.repeticoesAlvo,
            cargaSugerida: item.cargaSugerida,
        });
    }

    const resultado = await criarFichaComItens({ alunoId: dados.alunoId, itens });
    if (resultado.ok) revalidatePath("/alunos"); // atualiza o que depender das fichas
    return resultado;
}