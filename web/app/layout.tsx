import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "@/Components/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FitTrack",
    description: "Treinos para os seus alunos",
};

// async: precisa esperar a leitura dos cookies
export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    // Só olha se os cookies existem. Quem protege as páginas de verdade é o proxy.ts.
    const jar = await cookies();
    const logado = Boolean(jar.get("token")?.value);
    const nome = jar.get("nome")?.value;

    return (
        <html lang="pt-BR">
        <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased min-h-screen flex flex-col`}>
        <Header logado={logado} nome={nome} />
        <main className="flex-1 p-8">{children}</main>
        </body>
        </html>
    );
}