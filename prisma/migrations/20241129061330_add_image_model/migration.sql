-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pieceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Image_pieceId_idx" ON "Image"("pieceId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
