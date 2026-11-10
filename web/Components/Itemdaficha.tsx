"use client";

// Uma linha da ficha: nome do exercício + os campos do tipo dele.
//   Força : séries, repetições e carga
//   Cardio: tempo (min), velocidade (km/h) e inclinação (%)
// Tem botões para subir, descer e remover.

import type { CampoNumerico, ItemNaTela } from "@/lib/tipos-ficha";

const CLASSE_CAMPO =
    "w-full rounded-lg border border-zinc-800 bg-black px-2 py-1.5 text-center text-sm text-white outline-none focus:border-zinc-500";

function Campo({
                   rotulo,
                   valor,
                   onChange,
                   min,
                   max,
                   passo,
                   decimal,
                   dica,
               }: {
    rotulo: string;
    valor: string;
    onChange: (v: string) => void;
    min: number;
    max: number;
    passo?: string;
    decimal?: boolean;
    dica?: string;
}) {
    return (
        <label className="text-xs text-zinc-500">
            {rotulo}
            <input
                type="number"
                inputMode={decimal ? "decimal" : "numeric"}
                min={min}
                max={max}
                step={passo}
                value={valor}
                placeholder={dica}
                onChange={(e) => onChange(e.target.value)}
                className={CLASSE_CAMPO}
            />
        </label>
    );
}

export default function ItemDaFicha({
                                        item,
                                        posicao,
                                        total,
                                        onMudar,
                                        onRemover,
                                        onSubir,
                                        onDescer,
                                    }: {
    item: ItemNaTela;
    posicao: number; // começa em 1
    total: number;
    onMudar: (campo: CampoNumerico, valor: string) => void;
    onRemover: () => void;
    onSubir: () => void;
    onDescer: () => void;
}) {
    const cardio = item.tipo === "cardio";

    return (
        <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                        {posicao}. {item.nome}
                    </p>
                    <p className="text-xs text-zinc-500">
                        {cardio ? "Cardio" : "Força"}
                        {item.personalizado
                            ? " · personalizado"
                            : !cardio && item.grupoMuscular
                                ? ` · ${item.grupoMuscular}`
                                : ""}
                    </p>
                </div>

                <div className="flex shrink-0 gap-1">
                    <button
                        type="button"
                        onClick={onSubir}
                        disabled={posicao === 1}
                        aria-label="Subir"
                        className="h-7 w-7 rounded-md bg-zinc-900 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
                    >
                        ↑
                    </button>
                    <button
                        type="button"
                        onClick={onDescer}
                        disabled={posicao === total}
                        aria-label="Descer"
                        className="h-7 w-7 rounded-md bg-zinc-900 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
                    >
                        ↓
                    </button>
                    <button
                        type="button"
                        onClick={onRemover}
                        aria-label="Remover"
                        className="h-7 w-7 rounded-md bg-zinc-900 text-xs text-zinc-300 hover:bg-red-600 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
                {cardio ? (
                    <>
                        <Campo rotulo="Tempo (min)" valor={item.duracao} onChange={(v) => onMudar("duracao", v)} min={1} max={300} />
                        <Campo rotulo="Velocidade (km/h)" valor={item.velocidade} onChange={(v) => onMudar("velocidade", v)} min={0} max={40} passo="0.1" decimal dica="opcional" />
                        <Campo rotulo="Inclinação (%)" valor={item.inclinacao} onChange={(v) => onMudar("inclinacao", v)} min={0} max={40} passo="0.5" decimal dica="opcional" />
                    </>
                ) : (
                    <>
                        <Campo rotulo="Séries" valor={item.series} onChange={(v) => onMudar("series", v)} min={1} max={20} />
                        <Campo rotulo="Repetições" valor={item.repeticoes} onChange={(v) => onMudar("repeticoes", v)} min={1} max={100} />
                        <Campo rotulo="Carga (kg)" valor={item.carga} onChange={(v) => onMudar("carga", v)} min={0} max={1000} passo="0.5" decimal />
                    </>
                )}
            </div>
        </li>
    );
}