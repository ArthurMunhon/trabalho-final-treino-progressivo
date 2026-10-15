"use client";

// Painel da aba /alunos: tem o campo de busca e a grade de cards.
// É "use client" porque usa useState (o texto digitado muda a tela).

import { useState } from "react";
import AlunoCard, { AlunoCardProps } from "./AlunoCard";

type Props = {
    alunos: AlunoCardProps[];
};

export default function PainelAlunos({ alunos }: Props) {
    const [busca, setBusca] = useState("");

    // Filtra pelo nome, ignorando maiúsculas e acentos (ex: "jose" acha "José")
    const normalizar = (s: string) =>
        s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

    const filtrados = alunos.filter((a) =>
        normalizar(a.nome).includes(normalizar(busca))
    );

    return (
        <section className="space-y-4">
            <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar aluno pelo nome..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
            />

            {filtrados.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum aluno encontrado.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtrados.map((aluno) => (
                        <AlunoCard key={aluno.id} {...aluno} />
                    ))}
                </div>
            )}
        </section>
    );
}