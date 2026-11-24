// Caixa de pedidos de alunos na aba /alunos.
// Não precisa ser "use client": cada botão é um <form> que chama uma server action.

import { aceitar, recusar } from "@/app/alunos/acoes";
import type { Solicitacao } from "@/app/alunos/solicitacoes";

export default function Solicitacoespendentes({
                                                  solicitacoes,
                                              }: {
    solicitacoes: Solicitacao[];
}) {
    // Sem pedidos, a caixa nem aparece
    if (solicitacoes.length === 0) return null;

    return (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-100">
            <h2 className="mb-3 text-sm font-semibold uppercase text-indigo-300">
                Solicitações ({solicitacoes.length})
            </h2>

            <ul className="space-y-2">
                {solicitacoes.map((s) => (
                    <li
                        key={s.id}
                        className="flex items-center justify-between gap-3 rounded-lg bg-zinc-800 p-3"
                    >
                        <div className="min-w-0">
                            <p className="truncate font-medium">{s.aluno.nome}</p>
                            <p className="truncate text-sm text-zinc-400">
                                {s.aluno.email} ·{" "}
                                {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                            {/* ✓ aceitar: .bind(null, id) deixa a action com o id já preenchido */}
                            <form action={aceitar.bind(null, s.id)}>
                                <button
                                    type="submit"
                                    aria-label={`Aceitar ${s.aluno.nome}`}
                                    title="Aceitar"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20 text-lg font-bold text-green-400 hover:bg-green-500/30"
                                >
                                    ✓
                                </button>
                            </form>

                            {/* ✗ recusar */}
                            <form action={recusar.bind(null, s.id)}>
                                <button
                                    type="submit"
                                    aria-label={`Recusar ${s.aluno.nome}`}
                                    title="Recusar"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/20 text-lg font-bold text-red-400 hover:bg-red-500/30"
                                >
                                    ✕
                                </button>
                            </form>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}