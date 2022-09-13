/*
  Warnings:

  - You are about to drop the column `isEmailConfirmed` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `isEmailConfirmed`,
    ADD COLUMN `activationOtp` VARCHAR(191) NULL,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT false;
