import type { Metadata } from "next";
import Link from "next/link";
import SeletorAluno from "@/Components/Seletoralunos";
import SemanaFichas from "@/Components/Semanafichas";
import { listarAlunos } from "@/app/alunos/alunos";
import { listarFichasDoAluno } from "./fichas";

export const metadata: Metadata = {
    title: "Fichas",
};

// /fichas?aluno=<id>: mostra a semana do aluno escolhido (sem ?aluno, o primeiro da lista)
export default async function Page({ searchParams }: PageProps<"/fichas">) {
    const { aluno, erro } = await searchParams;

    const { dados: alunos } = await listarAlunos({ limit: 100 });
    const pedido = typeof aluno === "string" ? aluno : "";
    const escolhido = alunos.find((a) => a.id === pedido) ?? alunos[0];

    if (!escolhido) {
        return (
            <div className="mx-auto max-w-6xl p-6">
                <h1 className="text-2xl font-semibold">Fichas</h1>
                <p className="mt-4 text-zinc-400">
                    Você ainda não tem alunos.{" "}
                    <Link href="/alunos" className="underline">
                        Ver alunos
                    </Link>
                </p>
            </div>
        );
    }

    const fichas = await listarFichasDoAluno(escolhido.id);

    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold">Fichas</h1>
                <SeletorAluno alunos={alunos} atual={escolhido.id} />
            </div>

            {erro && (
                <p className="mb-3 rounded-md bg-red-500/20 p-3 text-sm text-red-300">
                    Não foi possível excluir a ficha. Ela pode ter treinos já registrados.
                </p>
            )}

            <h2 className="mb-3 text-lg font-medium">{escolhido.nome}</h2>
            <SemanaFichas alunoId={escolhido.id} fichas={fichas} />
        </div>
    );
}