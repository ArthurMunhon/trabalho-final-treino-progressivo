"use client";
// Botão de excluir com confirmação, usado para aluno e ficha.
// É client porque usa o confirm() do navegador.
// A server action já vem com os ids preenchidos (.bind), feito por quem usa o botão.

export default function BotaoExcluir({
                                         acao,
                                         texto,
                                         confirmacao,
                                     }: {
    acao: () => Promise<void>;
    texto: string; // ex.: "Excluir aluno"
    confirmacao: string; // ex.: "Excluir este aluno? Essa ação não pode ser desfeita."
}) {
    return (
        <form
            action={acao}
            onSubmit={(e) => {
                // Se o usuário cancelar, não envia o formulário
                if (!confirm(confirmacao)) {
                    e.preventDefault();
                }
            }}
        >
            <button
                type="submit"
                className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
                {texto}
            </button>
        </form>
    );
}