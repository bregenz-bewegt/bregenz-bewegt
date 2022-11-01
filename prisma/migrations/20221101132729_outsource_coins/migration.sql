/*
  Warnings:

  - The primary key for the `activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `points` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `coins` on the `user` table. All the data in the column will be lost.
  - Added the required column `coins` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `exercise` DROP COLUMN `points`,
    ADD COLUMN `coins` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `coins`;
