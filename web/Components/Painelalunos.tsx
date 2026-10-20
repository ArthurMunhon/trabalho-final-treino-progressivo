// Painel da aba /alunos (componente de servidor).
// Junta: filtro de busca + cards + paginação.

import AlunoCard, { AlunoCardProps } from "./AlunoCard";
import BuscaAluno from "./Buscaaluno";
import Paginacao from "./Paginacao";

export default function PainelAlunos({
                                         alunos,
                                         termo,
                                         pagina,
                                         totalDePaginas,
                                     }: {
    alunos: AlunoCardProps[];
    termo: string;
    pagina: number;
    totalDePaginas: number;
}) {
    return (
        <section className="space-y-4">
            <BuscaAluno termo={termo} />

            {alunos.length === 0 ? (
                <p className="text-sm">Nenhum aluno encontrado.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {alunos.map((aluno) => (
                        <AlunoCard key={aluno.id} {...aluno} />
                    ))}
                </div>
            )}

            <Paginacao pagina={pagina} totalDePaginas={totalDePaginas} termo={termo} />
        </section>
    );
}