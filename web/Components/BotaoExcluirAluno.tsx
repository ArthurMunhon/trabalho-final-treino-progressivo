"use client";
// Botão de excluir com confirmação. É client porque usa o confirm() do navegador.

import { excluirAluno } from "@/app/alunos/acoes";

export default function BotaoExcluirAluno({ id }: { id: string }) {
    return (
        // .bind(null, id) deixa a action já com o id preenchido
        <form
            action={excluirAluno.bind(null, id)}
            onSubmit={(e) => {
                // Se o usuário cancelar, não envia o formulário
                if (!confirm("Excluir este aluno? Essa ação não pode ser desfeita.")) {
                    e.preventDefault();
                }
            }}
        >
            <button
                type="submit"
                className="w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
            >
                Excluir aluno
            </button>
        </form>
    );
}