// Card de um aluno na aba /alunos.
// "Treino de Hoje" só aparece se o personal já definiu um treino na aba /treinos.

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

export default function AlunoCard({ nome, objetivo, treinoHoje }: AlunoCardProps) {
    // Iniciais para o avatar (ex: "Maria Silva" -> "MS")
    const iniciais = nome
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                    {iniciais}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{nome}</h3>
                    {objetivo && <p className="text-sm text-gray-500">{objetivo}</p>}
                </div>
            </div>

            {/* Só renderiza se existir treino para hoje */}
            {treinoHoje && (
                <div className="mt-4 rounded-lg bg-indigo-50 p-3">
                    <p className="text-xs font-semibold uppercase text-indigo-700">
                        Treino de Hoje:
                    </p>
                    <p className="text-sm text-gray-900">{treinoHoje.exercicio}</p>
                    <p className="text-xs text-gray-500">{treinoHoje.grupoMuscular}</p>
                </div>
            )}
        </div>
    );
}