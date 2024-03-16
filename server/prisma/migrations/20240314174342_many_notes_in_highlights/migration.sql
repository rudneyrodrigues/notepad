/*
  Warnings:

  - You are about to drop the column `noteId` on the `Highlight` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_noteId_fkey";

-- AlterTable
ALTER TABLE "Highlight" DROP COLUMN "noteId";

-- CreateTable
CREATE TABLE "_HighlightToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HighlightToNote_AB_unique" ON "_HighlightToNote"("A", "B");

-- CreateIndex
CREATE INDEX "_HighlightToNote_B_index" ON "_HighlightToNote"("B");

-- AddForeignKey
ALTER TABLE "_HighlightToNote" ADD CONSTRAINT "_HighlightToNote_A_fkey" FOREIGN KEY ("A") REFERENCES "Highlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HighlightToNote" ADD CONSTRAINT "_HighlightToNote_B_fkey" FOREIGN KEY ("B") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
