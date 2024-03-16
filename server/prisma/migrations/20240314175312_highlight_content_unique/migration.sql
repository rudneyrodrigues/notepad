/*
  Warnings:

  - A unique constraint covering the columns `[content]` on the table `Highlight` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Highlight_content_key" ON "Highlight"("content");
