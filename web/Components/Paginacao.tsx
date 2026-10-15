import Link from "next/link";

// Monta o endereço de uma página preservando a busca.
// Mudar de página não desfaz a busca; buscar volta sempre à página 1.
export function enderecoDaPagina(pagina: number, termo: string): string {
    const consulta = new URLSearchParams();
    if (termo !== "") consulta.set("busca", termo);
    if (pagina > 1) consulta.set("pagina", String(pagina));
    const texto = consulta.toString();
    return texto === "" ? "/alunos" : `/alunos?${texto}`;
}

// Componente de servidor: só links. Quem decide o que mostrar é a URL.
export default function Paginacao({
                                      pagina,
                                      totalDePaginas,
                                      termo,
                                  }: {
    pagina: number;
    totalDePaginas: number;
    termo: string;
}) {
    if (totalDePaginas <= 1) return null;

    const classe =
        "rounded-md border border-black/15 px-3 py-1 text-sm dark:border-white/20";

    return (
        <nav aria-label="Paginação" className="flex items-center gap-3">
            {pagina > 1 ? (
                <Link href={enderecoDaPagina(pagina - 1, termo)} className={`${classe} hover:bg-black/5 dark:hover:bg-white/10`}>
                    Anterior
                </Link>
            ) : (
                <span aria-disabled="true" className={`${classe} opacity-40`}>Anterior</span>
            )}

            <span className="text-sm">
        Página {pagina} de {totalDePaginas}
      </span>

            {pagina < totalDePaginas ? (
                <Link href={enderecoDaPagina(pagina + 1, termo)} className={`${classe} hover:bg-black/5 dark:hover:bg-white/10`}>
                    Próxima
                </Link>
            ) : (
                <span aria-disabled="true" className={`${classe} opacity-40`}>Próxima</span>
            )}
        </nav>
    );
}