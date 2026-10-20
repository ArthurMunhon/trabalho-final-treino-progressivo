import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
        <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 p-8">{children}</main>
        </body>
        </html>
    );
}