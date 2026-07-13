/*
  Warnings:

  - You are about to drop the column `targetRating` on the `predictions` table. All the data in the column will be lost.
  - You are about to drop the `business_recommendations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "business_recommendations" DROP CONSTRAINT "business_recommendations_userId_fkey";

-- AlterTable
ALTER TABLE "predictions" DROP COLUMN "targetRating";

-- DropTable
DROP TABLE "business_recommendations";

-- DropTable
DROP TABLE "products";
