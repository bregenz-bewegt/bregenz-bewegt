/*
  Warnings:

  - You are about to drop the column `activationOtp` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `activationOtp`,
    ADD COLUMN `activationSecret` VARCHAR(191) NULL;
