/*
  Warnings:

  - You are about to drop the column `chefId` on the `Dish` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telephone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `telephone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Dish" DROP CONSTRAINT "Dish_chefId_fkey";

-- DropIndex
DROP INDEX "Dish_chefId_idx";

-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "chefId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
ALTER COLUMN "telephone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_telephone_key" ON "User"("telephone");

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
