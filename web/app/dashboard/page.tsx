// app/dashboard/page.tsx
// Painel de boas-vindas. Protegido pelo exigirUsuario(): sem login, vai para /login.
// É um componente de servidor: o nome vem da API (GET /personal/me) com o token do cookie.

import Link from "next/link";
import { exigirUsuario } from "@/lib/sessao";

export default async function DashboardPage() {
    const { nome } = await exigirUsuario();

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-10">
            {/* Cabeçalho de Boas-Vindas */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                    Olá, <span className="text-zinc-400">{nome}</span> 👋
                </h1>
                <p className="text-zinc-400 text-lg">
                    Bem-vindo ao seu painel de controle. Gerencie seus alunos, monte treinos e acompanhe a evolução das fichas.
                </p>
            </div>

            {/* Cards de Atalho Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/alunos"
                    className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:scale-[1.01]"
                >
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Gestão
                        </span>
                        <h2 className="text-xl font-bold text-white group-hover:text-zinc-200">
                            Meus Alunos
                        </h2>
                        <p className="text-sm text-zinc-400">
                            Cadastre e acompanhe o progresso de todos os seus alunos cadastrados.
                        </p>
                    </div>
                    <span className="mt-6 text-sm font-medium text-white group-hover:underline">
                        Acessar Alunos &rarr;
                    </span>
                </Link>

                <Link
                    href="/treinos"
                    className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:scale-[1.01]"
                >
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Planejamento
                        </span>
                        <h2 className="text-xl font-bold text-white group-hover:text-zinc-200">
                            Biblioteca de Treinos
                        </h2>
                        <p className="text-sm text-zinc-400">
                            Monte rotinas de exercícios personalizadas com séries, repetições e cargas.
                        </p>
                    </div>
                    <span className="mt-6 text-sm font-medium text-white group-hover:underline">
                        Ver Treinos &rarr;
                    </span>
                </Link>

                <Link
                    href="/ficha"
                    className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:scale-[1.01]"
                >
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Acompanhamento
                        </span>
                        <h2 className="text-xl font-bold text-white group-hover:text-zinc-200">
                            Fichas de Treino
                        </h2>
                        <p className="text-sm text-zinc-400">
                            Associe fichas completas diretamente aos perfis dos seus alunos.
                        </p>
                    </div>
                    <span className="mt-6 text-sm font-medium text-white group-hover:underline">
                        Gerenciar Fichas &rarr;
                    </span>
                </Link>
            </div>

            {/* Resumo rápido */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        Pronto para montar uma nova ficha?
                    </h3>
                    <p className="text-sm text-zinc-400">
                        Adicione um novo aluno ou atualize as séries atuais em poucos cliques.
                    </p>
                </div>
                <Link
                    href="/ficha"
                    className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors shrink-0"
                >
                    + Criar Nova Ficha
                </Link>
            </div>
        </div>
    );
}
