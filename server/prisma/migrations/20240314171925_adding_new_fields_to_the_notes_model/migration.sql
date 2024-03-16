-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "trashed" BOOLEAN NOT NULL DEFAULT false;
