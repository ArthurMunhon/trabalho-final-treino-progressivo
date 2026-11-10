"use server";

import { revalidatePath } from "next/cache";
import { criarFichaComItens } from "@/lib/montar-ficha";
import type { FichaParaSalvar, ItemParaSalvar, ResultadoSalvar } from "@/lib/tipos-ficha";

// app/treinos/actions.ts
// Server Action chamada pelo botão "Salvar ficha".
// O navegador pode mandar qualquer coisa, então TUDO é validado de novo aqui.

function inteiroEntre(valor: unknown, min: number, max: number): valor is number {
    return typeof valor === "number" && Number.isInteger(valor) && valor >= min && valor <= max;
}

function numeroEntre(valor: unknown, min: number, max: number): valor is number {
    return typeof valor === "number" && Number.isFinite(valor) && valor >= min && valor <= max;
}

export async function salvarFicha(dados: FichaParaSalvar): Promise<ResultadoSalvar> {
    if (typeof dados?.alunoId !== "string" || dados.alunoId === "") {
        return { ok: false, erro: "Escolha o aluno." };
    }
    if (!Array.isArray(dados.itens) || dados.itens.length < 1 || dados.itens.length > 30) {
        return { ok: false, erro: "A ficha precisa ter de 1 a 30 exercícios." };
    }

    // Monta uma cópia limpa: só os campos esperados de cada tipo
    const itens: ItemParaSalvar[] = [];
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
        if (item.tipo !== "forca" && item.tipo !== "cardio") {
            return { ok: false, erro: `Exercício ${posicao}: tipo inválido.` };
        }

        const base = idCatalogo ? { exercicioId: idCatalogo } : { nomePersonalizado: nome };

        if (item.tipo === "forca") {
            if (!inteiroEntre(item.seriesAlvo, 1, 20)) {
                return { ok: false, erro: `Exercício ${posicao}: séries devem ser de 1 a 20.` };
            }
            if (!inteiroEntre(item.repeticoesAlvo, 1, 100)) {
                return { ok: false, erro: `Exercício ${posicao}: repetições devem ser de 1 a 100.` };
            }
            if (!numeroEntre(item.cargaSugerida, 0, 1000)) {
                return { ok: false, erro: `Exercício ${posicao}: carga deve ser de 0 a 1000 kg.` };
            }
            itens.push({
                ...base,
                tipo: "forca",
                seriesAlvo: item.seriesAlvo,
                repeticoesAlvo: item.repeticoesAlvo,
                cargaSugerida: item.cargaSugerida,
            });
        } else {
            if (!inteiroEntre(item.duracaoMin, 1, 300)) {
                return { ok: false, erro: `Exercício ${posicao}: tempo deve ser de 1 a 300 minutos.` };
            }
            // Velocidade e inclinação são opcionais (a bicicleta, por exemplo, não tem inclinação)
            if (item.velocidadeKmh !== undefined && !numeroEntre(item.velocidadeKmh, 0.1, 40)) {
                return { ok: false, erro: `Exercício ${posicao}: velocidade deve ser de 0,1 a 40 km/h.` };
            }
            if (item.inclinacaoPct !== undefined && !numeroEntre(item.inclinacaoPct, 0, 40)) {
                return { ok: false, erro: `Exercício ${posicao}: inclinação deve ser de 0 a 40%.` };
            }
            itens.push({
                ...base,
                tipo: "cardio",
                duracaoMin: item.duracaoMin,
                ...(item.velocidadeKmh !== undefined ? { velocidadeKmh: item.velocidadeKmh } : {}),
                ...(item.inclinacaoPct !== undefined ? { inclinacaoPct: item.inclinacaoPct } : {}),
            });
        }
    }

    const resultado = await criarFichaComItens({ alunoId: dados.alunoId, itens });
    if (resultado.ok) revalidatePath("/alunos"); // atualiza o que depender das fichas
    return resultado;
}