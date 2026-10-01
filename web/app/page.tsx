import Link from "next/link";

export default function Home() {
  return (
      <div className="flex flex-col flex-1 min-h-screen bg-zinc-50 font-sans dark:bg-black">
        {/* Header / Nav */}
        <header className="w-full border-b border-black/[.06] dark:border-white/[.08]">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-8 py-5">
          <span className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
            FitTrack
          </span>

            <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:flex">
              <Link href="/alunos" className="hover:text-black dark:hover:text-white transition-colors">
                Alunos
              </Link>
              <Link href="/treinos" className="hover:text-black dark:hover:text-white transition-colors">
                Treinos
              </Link>
              <Link href="/planos" className="hover:text-black dark:hover:text-white transition-colors">
                Planos
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                  href="/login"
                  className="flex h-10 items-center justify-center px-4 text-sm font-medium text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
              >
                Entrar
              </Link>
              <Link
                  href="/cadastro"
                  className="flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <main className="flex flex-1 w-full max-w-3xl mx-auto flex-col items-center justify-center gap-8 py-32 px-16 text-center">
          <div className="flex flex-col items-center gap-6">
            <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50">
              Monte treinos para seus alunos em minutos, não em horas.
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              A plataforma feita para personal trainers criarem, organizarem e
              acompanharem os treinos de cada aluno em um só lugar.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <Link
                className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-auto"
                href="/cadastro"
            >
              Registre-se
            </Link>
            <Link
                className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto"
                href="/sobre"
            >
              Como funciona
            </Link>
          </div>

          {/* Mini destaque de features */}
          <div className="mt-12 grid w-full grid-cols-1 gap-6 border-t border-black/[.06] pt-12 text-left dark:border-white/[.08] sm:grid-cols-3">
            <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-black dark:text-zinc-50">
              Biblioteca de exercícios
            </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Monte treinos rapidamente com exercícios prontos.
            </span>
            </div>
            <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-black dark:text-zinc-50">
              Gestão de alunos
            </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Acompanhe o progresso de cada aluno individualmente.
            </span>
            </div>
            <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-black dark:text-zinc-50">
              Envio simplificado
            </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Compartilhe o treino direto com o aluno, sem complicação.
            </span>
            </div>
          </div>
        </main>
      </div>
  );
}