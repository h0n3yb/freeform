/*
  Warnings:

  - The `status` column on the `Piece` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PieceStatus" AS ENUM ('GREENWARE', 'BISQUED', 'GLAZED', 'COMPLETED', 'PICKED_UP');

-- AlterTable
ALTER TABLE "Piece" DROP COLUMN "status",
ADD COLUMN     "status" "PieceStatus" NOT NULL DEFAULT 'GREENWARE';

-- CreateIndex
CREATE INDEX "Piece_status_idx" ON "Piece"("status");
