/*
  Warnings:

  - A unique constraint covering the columns `[fingerprint]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `fingerprint` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_fingerprint_key` ON `User`(`fingerprint`);
