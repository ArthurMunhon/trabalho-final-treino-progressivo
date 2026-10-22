// app/login/page.tsx
"use client";

import { useActionState } from "react";
import Link from "next/link";
import { entrar, type EstadoFormulario } from "./acoes";

const ESTADO_INICIAL: EstadoFormulario = { mensagem: "", email: "" };

export default function LoginPage() {
    // A action roda no servidor: faz o login na API, grava o cookie httpOnly
    // e redireciona. Aqui só voltam a mensagem de erro e o email digitado.
    const [estado, acao, pendente] = useActionState(entrar, ESTADO_INICIAL);

    return (
        <div className="flex flex-1 min-h-screen items-center justify-center bg-zinc-50 px-8 dark:bg-black">
            <div className="flex w-full max-w-sm flex-col gap-8">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
                        Entrar
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Acesse sua conta de personal trainer
                    </p>
                </div>

                <form action={acao} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            defaultValue={estado.email}
                            className="h-11 rounded-lg border border-black/[.08] bg-white px-3 text-sm outline-none focus:border-black/30 dark:border-white/[.145] dark:bg-black dark:focus:border-white/30"
                            placeholder="voce@email.com"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="senha"
                            required
                            className="h-11 rounded-lg border border-black/[.08] bg-white px-3 text-sm outline-none focus:border-black/30 dark:border-white/[.145] dark:bg-black dark:focus:border-white/30"
                            placeholder="••••••••"
                        />
                    </div>

                    {estado.mensagem && (
                        <p className="text-sm text-red-600 dark:text-red-400">{estado.mensagem}</p>
                    )}

                    <button
                        type="submit"
                        disabled={pendente}
                        className="mt-2 flex h-11 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
                    >
                        {pendente ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Ainda não tem conta?{" "}
                    <Link href="/cadastro" className="font-medium text-black dark:text-white">
                        Criar conta
                    </Link>
                </p>
            </div>
        </div>
    );
}
