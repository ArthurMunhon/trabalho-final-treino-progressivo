"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);

        function checkAuth() {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("token");
                const savedName = localStorage.getItem("userName");

                setIsLoggedIn(!!token);
                setUserName(savedName || "Personal");
            }
        }

        checkAuth();
        window.addEventListener("auth-change", checkAuth);
        return () => window.removeEventListener("auth-change", checkAuth);
    }, [pathname]);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setIsLoggedIn(false);
        setUserName("");
        router.push("/login");
    }

    // Header base para evitar erro de hidratação
    if (!mounted) {
        return (
            <header className="flex justify-between items-center px-8 h-16 border-b border-zinc-800 bg-black">
                <Link href="/" className="font-bold text-xl text-white">
                    FitTrack
                </Link>
            </header>
        );
    }

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
                        <button
                            onClick={handleLogout}
                            className="rounded-full bg-zinc-900 border border-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-red-600 hover:border-red-600 hover:text-white"
                        >
                            Sair
                        </button>
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