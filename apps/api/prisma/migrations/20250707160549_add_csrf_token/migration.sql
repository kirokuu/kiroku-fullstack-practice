-- CreateTable
CREATE TABLE "CsrfToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CsrfToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CsrfToken" ADD CONSTRAINT "CsrfToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
