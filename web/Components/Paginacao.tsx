'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function Paginacao({ totalDePaginas, paginaAtual }: { totalDePaginas: number; paginaAtual: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    function irParaPagina(pagina: number) {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(pagina));
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center gap-2 mt-6">
            <button
                disabled={paginaAtual <= 1}
                onClick={() => irParaPagina(paginaAtual - 1)}
                className="rounded border border-zinc-800 px-3 py-1 text-sm text-zinc-300 disabled:opacity-40"
            >
                Anterior
            </button>

            <span className="text-sm text-zinc-400">
        Página {paginaAtual} de {totalDePaginas}
      </span>

            <button
                disabled={paginaAtual >= totalDePaginas}
                onClick={() => irParaPagina(paginaAtual + 1)}
                className="rounded border border-zinc-800 px-3 py-1 text-sm text-zinc-300 disabled:opacity-40"
            >
                Próxima
            </button>
        </div>
    );
}