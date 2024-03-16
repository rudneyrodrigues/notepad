/*
  Warnings:

  - Added the required column `authorId` to the `Highlight` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Highlight_content_key";

-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
