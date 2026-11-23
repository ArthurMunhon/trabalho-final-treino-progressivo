// Card de um aluno na aba /alunos. Clicar nele abre /alunos/[id].
// "Treino de Hoje" só aparece se o personal já definiu um treino na aba /treinos.

import Link from "next/link";

export type TreinoHoje = {
    exercicio: string;
    grupoMuscular: string;
};

export type AlunoCardProps = {
    id: string;
    nome: string;
    objetivo?: string;
    treinoHoje?: TreinoHoje | null; // null/undefined = nada definido hoje
};

export default function AlunoCard({ id, nome, objetivo, treinoHoje }: AlunoCardProps) {
    // Iniciais para o avatar (ex: "Maria Silva" -> "MS")
    const iniciais = nome
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");

    return (
        // O card inteiro é um link para a página do aluno
        <Link
            href={`/alunos/${id}`}
            className="block rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-100 shadow-sm transition hover:border-zinc-600 hover:bg-zinc-800"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 font-semibold text-indigo-300">
                    {iniciais}
                </div>
                <div>
                    <h3 className="font-semibold text-zinc-100">{nome}</h3>
                    {objetivo && <p className="text-sm text-zinc-400">{objetivo}</p>}
                </div>
            </div>

            {/* Só renderiza se existir treino para hoje */}
            {treinoHoje && (
                <div className="mt-4 rounded-lg bg-zinc-800 p-3">
                    <p className="text-xs font-semibold uppercase text-indigo-300">
                        Treino de Hoje:
                    </p>
                    <p className="text-sm text-zinc-100">{treinoHoje.exercicio}</p>
                    <p className="text-xs text-zinc-400">{treinoHoje.grupoMuscular}</p>
                </div>
            )}
        </Link>
    );
}