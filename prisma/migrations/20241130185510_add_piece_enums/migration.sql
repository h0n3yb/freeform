/*
  Warnings:

  - You are about to drop the column `location` on the `Piece` table. All the data in the column will be lost.
  - Changed the type of `classType` on the `Piece` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `technique` on the `Piece` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('workshop', 'course', 'private_event');

-- CreateEnum
CREATE TYPE "Technique" AS ENUM ('wheel', 'handbuilding');

-- AlterTable
ALTER TABLE "Piece" DROP COLUMN "location",
ADD COLUMN     "shelfLocation" TEXT,
DROP COLUMN "classType",
ADD COLUMN     "classType" "ClassType" NOT NULL,
DROP COLUMN "technique",
ADD COLUMN     "technique" "Technique" NOT NULL;
