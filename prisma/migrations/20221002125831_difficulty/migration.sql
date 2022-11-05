/*
  Warnings:

  - You are about to drop the column `difficulty` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `preferences` table. All the data in the column will be lost.
  - Added the required column `difficultyId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exercise` DROP COLUMN `difficulty`,
    ADD COLUMN `difficultyId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `preferences` DROP COLUMN `difficulty`,
    ADD COLUMN `difficultyId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Difficulty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `difficulty` ENUM('BEGINNER', 'ADVANCED', 'GAME') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DifficultyToPreferences` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DifficultyToPreferences_AB_unique`(`A`, `B`),
    INDEX `_DifficultyToPreferences_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_difficultyId_fkey` FOREIGN KEY (`difficultyId`) REFERENCES `Difficulty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DifficultyToPreferences` ADD CONSTRAINT `_DifficultyToPreferences_A_fkey` FOREIGN KEY (`A`) REFERENCES `Difficulty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DifficultyToPreferences` ADD CONSTRAINT `_DifficultyToPreferences_B_fkey` FOREIGN KEY (`B`) REFERENCES `Preferences`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
