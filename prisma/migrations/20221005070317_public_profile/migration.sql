/*
  Warnings:

  - A unique constraint covering the columns `[difficulty]` on the table `Difficulty` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `preferences` ADD COLUMN `public` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX `Difficulty_difficulty_key` ON `Difficulty`(`difficulty`);
