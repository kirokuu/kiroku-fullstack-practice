/*
  Warnings:

  - Added the required column `tokenId` to the `CsrfToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CsrfToken" DROP CONSTRAINT "CsrfToken_userId_fkey";

-- AlterTable
ALTER TABLE "CsrfToken" ADD COLUMN     "tokenId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CsrfToken" ADD CONSTRAINT "CsrfToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
