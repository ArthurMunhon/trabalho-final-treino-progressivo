"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sair } from "@/app/login/acoes";

// O nome vem do layout (servidor), que lê a sessão do cookie httpOnly.
// null = ninguém logado.
export default function Header({ userName }: { userName: string | null }) {
    const pathname = usePathname();
    const isLoggedIn = userName !== null;

    return (
        <header className="grid grid-cols-3 items-center px-8 h-16 border-b border-zinc-800 bg-black">
            {/* Esquerda: Logo */}
            <div className="flex items-center">
                <Link href={isLoggedIn ? "/dashboard" : "/"} className="font-bold text-xl text-white tracking-tight">
                    FitTrack
                </Link>
            </div>

            {/* Centro: Rotas centralizadas */}
            <div className="flex justify-center">
                {isLoggedIn && (
                    <nav className="flex items-center gap-8 text-sm">
                        <Link
                            href="/dashboard"
                            className={`transition-colors ${
                                pathname === "/dashboard"
                                    ? "text-white font-semibold"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Início
                        </Link>
                        <Link
                            href="/alunos"
                            className={`transition-colors ${
                                pathname.startsWith("/alunos")
                                    ? "text-white font-semibold"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Alunos
                        </Link>
                        <Link
                            href="/treinos"
                            className={`transition-colors ${
                                pathname.startsWith("/treinos")
                                    ? "text-white font-semibold"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Treinos
                        </Link>
                        <Link
                            href="/fichas"
                            className={`transition-colors ${
                                pathname.startsWith("/fichas")
                                    ? "text-white font-semibold"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Fichas
                        </Link>
                    </nav>
                )}
            </div>

            {/* Direita: Usuário / Botões */}
            <div className="flex justify-end items-center gap-4">
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-300">
              {userName}
            </span>
                        {/* Logout por POST (Server Action), que apaga o cookie */}
                        <form action={sair}>
                            <button
                                type="submit"
                                className="rounded-full bg-zinc-900 border border-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-red-600 hover:border-red-600 hover:text-white"
                            >
                                Sair
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center">
                        <Link href="/login" className="text-sm text-zinc-300 hover:text-white">
                            Entrar
                        </Link>
                        <Link
                            href="/cadastro"
                            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
                        >
                            Criar conta
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}