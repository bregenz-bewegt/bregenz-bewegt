-- DropForeignKey
ALTER TABLE `preferences` DROP FOREIGN KEY `Preferences_userId_fkey`;

-- AlterTable
ALTER TABLE `preferences` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Preferences` ADD CONSTRAINT `Preferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
