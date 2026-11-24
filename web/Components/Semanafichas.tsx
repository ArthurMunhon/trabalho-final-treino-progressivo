// Semana de um aluno: 7 blocos (um por dia). Só desenha, não precisa ser client.
// Regra: a 1ª ficha cai na segunda, a 2ª na terça... a 6ª no sábado, a 7ª no domingo.
// Dia sem ficha mostra "Repouso" e o botão "Criar ficha".

import Link from "next/link";
import BotaoExcluir from "@/Components/BotaoExcluir";
import { excluirFicha } from "@/app/fichas/acoes";
import type { FichaSalva, ItemSalvo } from "@/app/fichas/fichas";

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Ordem em que as fichas ocupam os dias (0 = domingo): seg, ter, qua, qui, sex, sáb, dom
const ORDEM_DOS_DIAS = [1, 2, 3, 4, 5, 6, 0];

function nomeDoItem(item: ItemSalvo) {
    return item.exercicio?.nome ?? item.nomePersonalizado ?? "Exercício";
}

// Texto curto do que fazer: "4x10 · 20 kg" (força) ou "30 min · 8 km/h" (cardio)
function detalheDoItem(item: ItemSalvo) {
    const ehCardio = item.tipo === "cardio" || item.duracaoMin !== null;

    if (ehCardio) {
        const partes = [`${item.duracaoMin} min`];
        if (item.velocidadeKmh) partes.push(`${item.velocidadeKmh} km/h`);
        if (item.inclinacaoPct) partes.push(`${item.inclinacaoPct}%`);
        return partes.join(" · ");
    }

    const partes = [`${item.seriesAlvo}x${item.repeticoesAlvo}`];
    if (item.cargaSugerida) partes.push(`${item.cargaSugerida} kg`);
    return partes.join(" · ");
}

export default function SemanaFichas({
                                         alunoId,
                                         fichas,
                                     }: {
    alunoId: string;
    fichas: FichaSalva[];
}) {
    // porDia[0] = domingo ... porDia[6] = sábado
    const porDia: (FichaSalva | undefined)[] = Array(7).fill(undefined);
    fichas.slice(0, 7).forEach((ficha, posicao) => {
        porDia[ORDEM_DOS_DIAS[posicao]] = ficha;
    });
    const sobraram = Math.max(0, fichas.length - 7);

    return (
        <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
                {DIAS.map((dia, indice) => {
                    const ficha = porDia[indice];

                    return (
                        <section
                            key={dia}
                            className="flex min-h-40 flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-zinc-100"
                        >
                            <h2 className="mb-2 text-sm font-semibold text-indigo-300">{dia}</h2>

                            {ficha ? (
                                <>
                                    <ul className="space-y-2">
                                        {ficha.itens.map((item) => (
                                            <li key={item.id} className="rounded-md bg-zinc-800 p-2">
                                                <p className="text-sm font-medium">{nomeDoItem(item)}</p>
                                                <p className="text-xs text-zinc-400">{detalheDoItem(item)}</p>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-3">
                                        <BotaoExcluir
                                            acao={excluirFicha.bind(null, ficha.id, alunoId)}
                                            texto="Excluir ficha"
                                            confirmacao="Excluir esta ficha? As fichas seguintes sobem um dia."
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-1 flex-col justify-end gap-2">
                                    <p className="rounded-md bg-zinc-800 p-2 text-center text-sm text-zinc-400">
                                        Repouso
                                    </p>
                                    <Link
                                        href={`/treinos?aluno=${alunoId}`}
                                        className="rounded-md border border-zinc-700 p-2 text-center text-sm text-zinc-200 hover:bg-zinc-800"
                                    >
                                        Criar ficha
                                    </Link>
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>

            {sobraram > 0 && (
                <p className="mt-3 text-sm text-zinc-400">
                    Este aluno tem {sobraram} ficha{sobraram > 1 ? "s" : ""} além dos 7 dias da
                    semana, que não aparece{sobraram > 1 ? "m" : ""} aqui.
                </p>
            )}
        </div>
    );
}