-- DropForeignKey
ALTER TABLE "Item_Ficha" DROP CONSTRAINT "Item_Ficha_fichaId_fkey";

-- AddForeignKey
ALTER TABLE "Item_Ficha" ADD CONSTRAINT "Item_Ficha_fichaId_fkey" FOREIGN KEY ("fichaId") REFERENCES "Ficha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
