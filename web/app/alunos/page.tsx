// app/alunos/page.tsx
// Server component: lê ?busca e ?pagina da URL e pede ao back-end só aquela página.

import PainelAlunos from "@/Components/Painelalunos";
import type { AlunoCardProps } from "@/Components/AlunoCard";
import { listarAlunos } from "@/lib/alunos";

const POR_PAGINA = 9;

export default async function AlunosPage({
                                             searchParams,
                                         }: {
    // No Next 15/16, searchParams é uma Promise
    searchParams: Promise<{ busca?: string; pagina?: string }>;
}) {
    const { busca = "", pagina: paginaTexto } = await searchParams;
    const termo = busca.trim();
    const pagina = Math.max(1, Number(paginaTexto) || 1);

    const resultado = await listarAlunos({ page: pagina, limit: POR_PAGINA, busca: termo });

    const lista: AlunoCardProps[] = resultado.dados.map((a) => ({
        id: a.id,
        nome: a.nome,
        objetivo: a.email, // aluno ainda não tem "objetivo"
        treinoHoje: null,  // será ligado a lib/sessoes.ts depois
    }));

    return (
        <main className="mx-auto max-w-5xl p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Meus Alunos</h1>
            <PainelAlunos
                alunos={lista}
                termo={termo}
                pagina={resultado.page}
                totalDePaginas={resultado.totalDePaginas}
            />
        </main>
    );
}