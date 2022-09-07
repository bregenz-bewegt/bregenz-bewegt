/*
  Warnings:

  - Made the column `isEmailConfirmed` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `isEmailConfirmed` BOOLEAN NOT NULL DEFAULT false;
