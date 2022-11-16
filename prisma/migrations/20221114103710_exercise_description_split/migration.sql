-- AlterTable
ALTER TABLE `exercise` ADD COLUMN `execution` VARCHAR(191) NULL,
    ADD COLUMN `muscles` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(1000) NOT NULL;
