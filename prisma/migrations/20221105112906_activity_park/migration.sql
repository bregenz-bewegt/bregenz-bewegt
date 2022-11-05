/*
  Warnings:

  - Added the required column `parkId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` ADD COLUMN `parkId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_parkId_fkey` FOREIGN KEY (`parkId`) REFERENCES `Park`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
