/*
  Warnings:

  - A unique constraint covering the columns `[discount_code]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `organizers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tag]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[referral_number,email,username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end_time` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `ratings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_referral_number_email_key` ON `users`;

-- AlterTable
ALTER TABLE `events` ADD COLUMN `discount_code` INTEGER NULL,
    ADD COLUMN `discount_usage_limit` INTEGER NULL,
    ADD COLUMN `end_time` VARCHAR(191) NOT NULL,
    ADD COLUMN `start_time` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ratings` ADD COLUMN `rating` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_verified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `profile_picture` VARCHAR(191) NULL,
    ADD COLUMN `redeem_code_expired` DATETIME(3) NULL,
    ADD COLUMN `use_redeem_code` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `otpcodes` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `otp_code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `otpcodes_user_id_idx`(`user_id`),
    INDEX `otpcodes_otp_code_idx`(`otp_code`),
    UNIQUE INDEX `otpcodes_user_id_otp_code_key`(`user_id`, `otp_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `events_discount_code_key` ON `events`(`discount_code`);

-- CreateIndex
CREATE INDEX `events_event_type_idx` ON `events`(`event_type`);

-- CreateIndex
CREATE UNIQUE INDEX `organizers_user_id_key` ON `organizers`(`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `tags_tag_key` ON `tags`(`tag`);

-- CreateIndex
CREATE UNIQUE INDEX `users_username_key` ON `users`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `users_referral_number_email_username_key` ON `users`(`referral_number`, `email`, `username`);

-- AddForeignKey
ALTER TABLE `otpcodes` ADD CONSTRAINT `otpcodes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `ratings` RENAME INDEX `ratings_user_id_fkey` TO `ratings_user_id_idx`;

-- RenameIndex
ALTER TABLE `reviews` RENAME INDEX `reviews_user_id_fkey` TO `reviews_user_id_idx`;
