/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `CsrfToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CsrfToken_tokenId_key" ON "CsrfToken"("tokenId");
