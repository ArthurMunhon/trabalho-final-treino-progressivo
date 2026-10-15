export default function Home() {
  return (
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center min-h-[calc(100vh-85px)] px-8">
        {/* Mini destaque de features */}
        <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3">
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
      </div>
  );
}