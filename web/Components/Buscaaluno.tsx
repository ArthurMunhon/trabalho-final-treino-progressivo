"use client";

// Busca de alunos que pesquisa enquanto você digita.
// Para não mandar uma requisição a cada tecla, espera o usuário parar de
// digitar por ATRASO_MS antes de atualizar a URL (/alunos?busca=...).
// Como a página lê a busca da URL, o servidor refiltra sozinho.

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const ATRASO_MS = 400;

export default function BuscaAluno({ termo }: { termo: string }) {
    const router = useRouter();
    const [valor, setValor] = useState(termo);
    const [pendente, iniciar] = useTransition();

    // Último termo que já está na URL (ou que já mandamos para ela).
    const ultimoEnviado = useRef(termo);

    // Se a URL mudar por fora (ex.: link "Limpar a busca", botão voltar),
    // o campo acompanha. Ignora quando a mudança foi a que nós mesmos fizemos.
    useEffect(() => {
        if (termo !== ultimoEnviado.current) {
            ultimoEnviado.current = termo;
            setValor(termo);
        }
    }, [termo]);

    // Debounce: cada tecla reinicia o cronômetro; só depois de ATRASO_MS
    // sem digitar é que a URL é atualizada.
    useEffect(() => {
        const novo = valor.trim();
        if (novo === ultimoEnviado.current) return;

        const cronometro = setTimeout(() => {
            ultimoEnviado.current = novo;
            const endereco =
                novo === "" ? "/alunos" : `/alunos?${new URLSearchParams({ busca: novo })}`;
            // replace: não enche o histórico com uma entrada por busca.
            // Sem "pagina" na URL, buscar volta sempre à página 1.
            iniciar(() => router.replace(endereco));
        }, ATRASO_MS);

        return () => clearTimeout(cronometro);
    }, [valor, router]);

    return (
        // onSubmit evita recarregar a página se o usuário apertar Enter
        <form onSubmit={(e) => e.preventDefault()} className="block">
            <label className="block text-sm">
                Aluno {pendente && <span className="opacity-60">(buscando...)</span>}
                <input
                    name="busca"
                    type="search"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Parte do nome do aluno"
                    autoComplete="off"
                    className="mt-1 block w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
                />
            </label>
        </form>
    );
}