/*
  Warnings:

  - You are about to drop the column `googleUserId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the `GoogleUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_googleUserId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "googleUserId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT;

-- DropTable
DROP TABLE "GoogleUser";
