"use client";

// Cartão de um exercício do catálogo.
// Pode ser ARRASTADO para a ficha, ou adicionado com o botão "+" (no celular
// o arrastar do navegador não funciona, por isso o botão existe).

import type { Exercicio } from "@/lib/exercicios";
import { tipoDoExercicio } from "@/lib/tipos-ficha";

export default function CartaoExercicio({
                                            exercicio,
                                            jaNaFicha,
                                            onAdicionar,
                                        }: {
    exercicio: Exercicio;
    jaNaFicha: boolean;
    onAdicionar: () => void;
}) {
    return (
        <div
            // draggable = o navegador deixa arrastar este elemento
            draggable={!jaNaFicha}
            onDragStart={(e) => {
                // Guarda o id do exercício "dentro" do arrasto; a ficha lê no onDrop
                e.dataTransfer.setData("text/plain", exercicio.id);
                e.dataTransfer.effectAllowed = "copy";
            }}
            className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${
                jaNaFicha
                    ? "border-zinc-900 bg-zinc-950 opacity-40"
                    : "cursor-grab border-zinc-800 bg-zinc-950 hover:border-zinc-600 active:cursor-grabbing"
            }`}
        >
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{exercicio.nome}</p>
                <p className="text-xs capitalize text-zinc-500">
                    {tipoDoExercicio(exercicio) === "cardio" ? "Cardio" : exercicio.grupoMuscular}
                </p>
            </div>

            <button
                type="button"
                onClick={onAdicionar}
                disabled={jaNaFicha}
                aria-label={`Adicionar ${exercicio.nome}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold leading-none text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
            >
                {jaNaFicha ? "✓" : "+"}
            </button>
        </div>
    );
}