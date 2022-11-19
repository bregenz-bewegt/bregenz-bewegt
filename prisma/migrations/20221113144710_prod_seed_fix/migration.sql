-- DropForeignKey
ALTER TABLE `coordinates` DROP FOREIGN KEY `Coordinates_parkId_fkey`;

-- DropForeignKey
ALTER TABLE `exercise` DROP FOREIGN KEY `Exercise_difficultyId_fkey`;

-- AlterTable
ALTER TABLE `coordinates` MODIFY `parkId` INTEGER NULL;

-- AlterTable
ALTER TABLE `exercise` MODIFY `difficultyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Coordinates` ADD CONSTRAINT `Coordinates_parkId_fkey` FOREIGN KEY (`parkId`) REFERENCES `Park`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_difficultyId_fkey` FOREIGN KEY (`difficultyId`) REFERENCES `Difficulty`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
