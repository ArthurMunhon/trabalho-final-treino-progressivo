import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PainelAlunos from "@/Components/Painelalunos";
import { enderecoDaPagina } from "@/Components/Paginacao";
import type { AlunoCardProps } from "@/Components/AlunoCard";
import { listarAlunos } from "@/lib/alunos";
import { exigirUsuario } from "@/lib/sessao";

export const metadata: Metadata = {
    title: "Alunos",
};

const POR_PAGINA = 9;

// Converte o parâmetro `pagina` da URL. Ausente é a primeira página; qualquer
// coisa que não seja um inteiro positivo é um endereço que não pode existir.
function lerPagina(valor: string | string[] | undefined): number | null {
    if (valor === undefined) {
        return 1;
    }
    if (typeof valor !== "string" || !/^[1-9]\d*$/.test(valor)) {
        return null;
    }
    const numero = Number(valor);
    return Number.isSafeInteger(numero) ? numero : null;
}

// Ler `searchParams` já torna a página dinâmica (depende da requisição).
export default async function Page({ searchParams }: PageProps<"/alunos">) {
    await exigirUsuario(); // sem login, vai para /login

    const { busca, pagina } = await searchParams;

    // `?busca=a&busca=b` chega como vetor. Só o texto simples é aceito.
    const termo = typeof busca === "string" ? busca.trim() : "";
    const numeroDaPagina = lerPagina(pagina);

    if (numeroDaPagina === null) {
        notFound();
    }

    const resultado = await listarAlunos({
        page: numeroDaPagina,
        limit: POR_PAGINA,
        busca: termo,
    });

    // O back-end devolve só { dados, total, page, limit }, sem totalDePaginas.
    // Então calculamos aqui: 15 alunos / 9 por página = 2 páginas.
    const totalDePaginas = Math.max(1, Math.ceil(resultado.total / POR_PAGINA));

    const lista: AlunoCardProps[] = resultado.dados.map((a) => ({
        id: a.id,
        nome: a.nome,
        objetivo: a.email, // aluno ainda não tem "objetivo"
        treinoHoje: null, // será ligado a lib/sessoes.ts depois
    }));

    return (
        <div className="mx-auto max-w-5xl p-6">
            <h1 className="text-2xl font-semibold">Alunos</h1>

            <div className="mt-4 space-y-4">
                <p className="text-sm opacity-80">
                    {resultado.total === 0
                        ? "Nenhum aluno encontrado"
                        : `${resultado.total} ${resultado.total === 1 ? "aluno" : "alunos"}`}
                    {termo !== "" ? ` para "${termo}"` : ""}.
                    {termo !== "" ? (
                        <>
                            {" "}
                            <Link href="/alunos" className="underline">
                                Limpar a busca
                            </Link>
                        </>
                    ) : null}
                </p>

                {/* Página além da última não é 404: pode passar a existir depois. */}
                {resultado.total > 0 && numeroDaPagina > totalDePaginas ? (
                    <p className="text-sm">
                        A página {numeroDaPagina} não existe nesta consulta.{" "}
                        <Link
                            href={enderecoDaPagina(totalDePaginas, termo)}
                            className="underline"
                        >
                            Ir para a página {totalDePaginas}
                        </Link>
                    </p>
                ) : (
                    <PainelAlunos
                        alunos={lista}
                        termo={termo}
                        pagina={numeroDaPagina}
                        totalDePaginas={totalDePaginas}
                    />
                )}
            </div>
        </div>
    );
}