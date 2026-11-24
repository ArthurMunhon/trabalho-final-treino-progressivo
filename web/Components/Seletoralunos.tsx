"use client";
// Lista para escolher o aluno. É client só por causa do onChange:
// ao trocar, vai para /fichas?aluno=<id> e a página (server) busca a semana dele.

import { useRouter } from "next/navigation";

export default function SeletorAluno({
                                         alunos,
                                         atual,
                                     }: {
    alunos: { id: string; nome: string }[];
    atual: string;
}) {
    const router = useRouter();

    return (
        <select
            value={atual}
            onChange={(e) => router.push(`/fichas?aluno=${e.target.value}`)}
            aria-label="Aluno"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
        >
            {alunos.map((a) => (
                <option key={a.id} value={a.id}>
                    {a.nome}
                </option>
            ))}
        </select>
    );
}