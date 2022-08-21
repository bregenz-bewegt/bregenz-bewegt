/*
  Warnings:

  - You are about to drop the column `parkId` on the `exercise` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `exercise` DROP FOREIGN KEY `Exercise_parkId_fkey`;

-- AlterTable
ALTER TABLE `exercise` DROP COLUMN `parkId`,
    MODIFY `difficulty` ENUM('BEGINNER', 'ADVANCED', 'GAME') NOT NULL;

-- AlterTable
ALTER TABLE `preferences` MODIFY `difficulty` ENUM('BEGINNER', 'ADVANCED', 'GAME') NULL;

-- CreateTable
CREATE TABLE `_ExerciseToPark` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ExerciseToPark_AB_unique`(`A`, `B`),
    INDEX `_ExerciseToPark_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ExerciseToPark` ADD CONSTRAINT `_ExerciseToPark_A_fkey` FOREIGN KEY (`A`) REFERENCES `Exercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExerciseToPark` ADD CONSTRAINT `_ExerciseToPark_B_fkey` FOREIGN KEY (`B`) REFERENCES `Park`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
