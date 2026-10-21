-- Aluno passa a pertencer a um Personal.
-- Alunos que ja existiam sao ligados ao primeiro personal cadastrado,
-- para a coluna poder virar obrigatoria sem apagar dados.

-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN "personalId" TEXT;

UPDATE "Aluno"
SET "personalId" = (SELECT "id" FROM "Personal" ORDER BY "id" LIMIT 1)
WHERE "personalId" IS NULL;

ALTER TABLE "Aluno" ALTER COLUMN "personalId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "Personal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
