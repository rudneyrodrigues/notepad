/*
  Warnings:

  - Added the required column `googleUserId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "googleUserId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GoogleUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,

    CONSTRAINT "GoogleUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleUser_email_key" ON "GoogleUser"("email");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_googleUserId_fkey" FOREIGN KEY ("googleUserId") REFERENCES "GoogleUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
