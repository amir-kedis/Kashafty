/*
  Warnings:

  - Added the required column `name` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "name" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "captainId" DROP NOT NULL;
