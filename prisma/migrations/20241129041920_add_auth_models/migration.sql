/*
  Warnings:

  - You are about to drop the column `classType` on the `Piece` table. All the data in the column will be lost.
  - You are about to drop the column `glaze` on the `Piece` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Piece` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Piece` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Piece` table. All the data in the column will be lost.
  - The `status` column on the `Piece` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Piece` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Piece` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_pieceId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pieceId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Piece" DROP CONSTRAINT "Piece_studentId_fkey";

-- DropIndex
DROP INDEX "Piece_classType_idx";

-- DropIndex
DROP INDEX "Piece_shelfLocation_idx";

-- DropIndex
DROP INDEX "Piece_studentId_idx";

-- AlterTable
ALTER TABLE "Piece" DROP COLUMN "classType",
DROP COLUMN "glaze",
DROP COLUMN "name",
DROP COLUMN "notes",
DROP COLUMN "studentId",
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS';

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Notification";

-- DropEnum
DROP TYPE "ClassType";

-- DropEnum
DROP TYPE "ImageType";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "PieceStatus";

-- DropEnum
DROP TYPE "UserRole";

-- CreateIndex
CREATE INDEX "Piece_userId_idx" ON "Piece"("userId");

-- CreateIndex
CREATE INDEX "Piece_status_idx" ON "Piece"("status");

-- AddForeignKey
ALTER TABLE "Piece" ADD CONSTRAINT "Piece_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
