-- CreateTable
CREATE TABLE "Aluno" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ficha" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ficha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personal" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessao_Treino" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "fichaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessao_Treino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serie_Executada" (
    "id" TEXT NOT NULL,
    "sessao_treinoId" TEXT NOT NULL,
    "numero_Serie" INTEGER NOT NULL,
    "cargaUsada" DOUBLE PRECISION NOT NULL,
    "repeticoesFeitas" INTEGER NOT NULL,
    "itemFichaId" TEXT NOT NULL,

    CONSTRAINT "Serie_Executada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item_Ficha" (
    "id" TEXT NOT NULL,
    "fichaId" TEXT NOT NULL,
    "exercicioId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "seriesAlvo" INTEGER NOT NULL,
    "repeticoesAlvo" INTEGER NOT NULL,
    "cargaSugerida" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Item_Ficha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "grupoMuscular" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_email_key" ON "Aluno"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Personal_email_key" ON "Personal"("email");

-- AddForeignKey
ALTER TABLE "Ficha" ADD CONSTRAINT "Ficha_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ficha" ADD CONSTRAINT "Ficha_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessao_Treino" ADD CONSTRAINT "Sessao_Treino_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessao_Treino" ADD CONSTRAINT "Sessao_Treino_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "Ficha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serie_Executada" ADD CONSTRAINT "Serie_Executada_sessao_treinoId_fkey" FOREIGN KEY ("sessao_treinoId") REFERENCES "Sessao_Treino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serie_Executada" ADD CONSTRAINT "Serie_Executada_itemFichaId_fkey" FOREIGN KEY ("itemFichaId") REFERENCES "Item_Ficha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Ficha" ADD CONSTRAINT "Item_Ficha_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "Ficha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Ficha" ADD CONSTRAINT "Item_Ficha_exercicioId_fkey" FOREIGN KEY ("exercicioId") REFERENCES "Exercicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
