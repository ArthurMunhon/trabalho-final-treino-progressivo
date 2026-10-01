// app/cadastro/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, role: "TRAINER" }),
            });

            if (!res.ok) throw new Error("Não foi possível criar a conta");

            const data = await res.json();
            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao cadastrar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-1 min-h-screen items-center justify-center bg-zinc-50 px-8 dark:bg-black">
            <div className="flex w-full max-w-sm flex-col gap-8">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
                        Criar conta de personal trainer
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Seus alunos vão acessar pelo app — essa conta é só pra você
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Nome
                        </label>
                        <input
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="h-11 rounded-lg border border-black/[.08] bg-white px-3 text-sm outline-none focus:border-black/30 dark:border-white/[.145] dark:bg-black dark:focus:border-white/30"
                            placeholder="Seu nome"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
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
                            name="password"
                            required
                            minLength={6}
                            value={form.password}
                            onChange={handleChange}
                            className="h-11 rounded-lg border border-black/[.08] bg-white px-3 text-sm outline-none focus:border-black/30 dark:border-white/[.145] dark:bg-black dark:focus:border-white/30"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex h-11 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
                    >
                        {loading ? "Criando conta..." : "Criar conta"}
                    </button>
                </form>

                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Já tem conta?{" "}
                    <Link href="/login" className="font-medium text-black dark:text-white">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
}