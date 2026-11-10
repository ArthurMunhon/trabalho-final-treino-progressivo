// app/treinos/page.tsx
// Aba "Treinos": o personal escolhe um aluno e monta a ficha arrastando exercícios.
// Componente de servidor: busca os alunos DELE e o catálogo, e entrega para a tela.

import type { Metadata } from "next";
import ConstrutorFicha from "@/Components/Construtorficha";
import { listarAlunos } from "@/lib/alunos";
import { listarExercicios } from "@/lib/exercicios";

export const metadata: Metadata = {
    title: "Treinos",
};

export default async function Page() {
    // Busca as duas listas ao mesmo tempo
    const [alunos, exercicios] = await Promise.all([
        listarAlunos({ limit: 100 }), // só os alunos deste personal (o back-end filtra pelo token)
        listarExercicios({ limit: 100 }),
    ]);

    return (
        <div className="mx-auto max-w-6xl p-6">
            <h1 className="text-2xl font-semibold">Treinos</h1>
            <p className="mt-1 mb-6 text-sm text-zinc-400">
                Escolha o aluno e arraste os exercícios para montar a ficha.
            </p>

            <ConstrutorFicha alunos={alunos.dados} exercicios={exercicios.dados} />
        </div>
    );
}