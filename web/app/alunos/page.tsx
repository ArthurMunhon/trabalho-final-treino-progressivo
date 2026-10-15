// app/alunos/page.tsx
// Server component: busca os alunos do personal e entrega ao painel.

import PainelAlunos from "@/Components/Painelalunos";
import type { AlunoCardProps } from "@/Components/AlunoCard";
// ATENÇÃO: ajuste o nome da função e o formato conforme o seu lib/alunos.ts
import { listarAlunos } from "@/lib/alunos";

export default async function page() {
    // Troque pelo que o seu lib realmente retorna
    const { dados } = await listarAlunos({ limit: 100 });

    // Converte para o formato que o card espera.
    // treinoHoje fica null até ligarmos com lib/sessoes.ts
    const lista: AlunoCardProps[] = dados.map((a) => ({
        id: String(a.id),
        nome: a.nome,
        objetivo: a.email,
        treinoHoje: null,
    }));

    return (
        <main className="mx-auto max-w-5xl p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Meus Alunos</h1>
            <PainelAlunos alunos={lista} />
        </main>
    );
}