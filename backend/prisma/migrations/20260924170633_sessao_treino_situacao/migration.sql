-- CreateEnum
CREATE TYPE "SituacaoSessao" AS ENUM ('em_andamento', 'finalizada');

-- AlterTable
ALTER TABLE "Sessao_Treino" ADD COLUMN     "situacao" "SituacaoSessao" NOT NULL DEFAULT 'em_andamento';
