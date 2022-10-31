/*
  Warnings:

  - You are about to drop the column `points` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `coins` on the `user` table. All the data in the column will be lost.
  - Added the required column `coins` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `exercise` DROP COLUMN `points`,
    ADD COLUMN `coins` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `coins`;
