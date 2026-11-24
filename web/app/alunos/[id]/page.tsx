// app/alunos/[id]/page.tsx
// Página de um aluno: mostra o card dele e o botão de excluir.
// Componente de servidor: busca o aluno no back-end (com o token do cookie).

import Link from "next/link";
import { notFound } from "next/navigation";
import BotaoExcluir from "@/Components/BotaoExcluir";
import { buscarAluno } from "@/app/alunos/alunos";
// No Next 16, params e searchParams são Promises: precisa do await
export default async function Page({
                                       params,
                                       searchParams,
                                   }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ erro?: string }>;
}) {
    const { id } = await params;
    const { erro } = await searchParams;

    const aluno = await buscarAluno(id);
    if (!aluno) notFound(); // 404 se não existe (ou não é aluno deste personal)

    // Iniciais para o avatar: "Ana Beatriz" -> "AB"
    const iniciais = aluno.nome
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();

    return (
        <div className="mx-auto max-w-xl p-6">
            <Link href="/alunos" className="text-sm text-zinc-400 hover:text-white">
                ← Voltar para alunos
            </Link>

            <div className="mt-4 rounded-xl bg-white p-6 text-zinc-900">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
                        {iniciais}
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">{aluno.nome}</h1>
                        <p className="text-zinc-600">{aluno.email}</p>
                    </div>
                </div>

                {erro && (
                    <p className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
                        Não foi possível excluir. O aluno pode ter fichas ou treinos registrados.
                    </p>
                )}

                <div className="mt-6 border-t border-zinc-200 pt-4">
                    <BotaoExcluir id={aluno.id} />
                </div>
            </div>
        </div>
    );
}