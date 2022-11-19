/*
  Warnings:

  - You are about to alter the column `description` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `exercise` MODIFY `description` JSON NOT NULL;
