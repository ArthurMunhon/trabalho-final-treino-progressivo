-- CreateEnum
CREATE TYPE "TipoExercicio" AS ENUM ('forca', 'cardio');

-- DropForeignKey
ALTER TABLE "Item_Ficha" DROP CONSTRAINT "Item_Ficha_exercicioId_fkey";

-- DropForeignKey
ALTER TABLE "Item_Ficha" DROP CONSTRAINT "Item_Ficha_fichaId_fkey";

-- AlterTable
ALTER TABLE "Item_Ficha" ADD COLUMN     "duracaoMin" INTEGER,
ADD COLUMN     "inclinacaoPct" DOUBLE PRECISION,
ADD COLUMN     "nomePersonalizado" TEXT,
ADD COLUMN     "tipo" "TipoExercicio" NOT NULL DEFAULT 'forca',
ADD COLUMN     "velocidadeKmh" DOUBLE PRECISION,
ALTER COLUMN "exercicioId" DROP NOT NULL,
ALTER COLUMN "seriesAlvo" DROP NOT NULL,
ALTER COLUMN "repeticoesAlvo" DROP NOT NULL,
ALTER COLUMN "cargaSugerida" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Item_Ficha" ADD CONSTRAINT "Item_Ficha_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "Ficha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Ficha" ADD CONSTRAINT "Item_Ficha_exercicioId_fkey" FOREIGN KEY ("exercicioId") REFERENCES "Exercicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
