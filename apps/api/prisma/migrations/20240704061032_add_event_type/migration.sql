/*
  Warnings:

  - You are about to drop the column `event_type_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `social_link_id` on the `organizers` table. All the data in the column will be lost.
  - The values [customer,organizer] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `eventTypes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[event_id,user_id]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id,user_id]` on the table `eventLikes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id,tag_id]` on the table `eventTags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id,user_id]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id,user_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_type` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_event_type_id_fkey`;

-- DropIndex
DROP INDEX `organizers_social_link_id_key` ON `organizers`;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `event_type_id`,
    ADD COLUMN `event_type` ENUM('MUSIC', 'NIGHTLIFE', 'PERFORMING_VISUAL_ARTS', 'HOLIDAYS', 'DATING', 'HOBBIES', 'BUSINESS', 'FOOD_AND_DRINK') NOT NULL,
    MODIFY `thumbnail` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `organizers` DROP COLUMN `social_link_id`;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('CUSTOMER', 'ORGANIZER') NOT NULL,
    MODIFY `like_event` INTEGER NULL,
    MODIFY `review_event` INTEGER NULL,
    MODIFY `event_rating` INTEGER NULL;

-- DropTable
DROP TABLE `eventTypes`;

-- CreateIndex
CREATE UNIQUE INDEX `attendees_event_id_user_id_key` ON `attendees`(`event_id`, `user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `eventLikes_event_id_user_id_key` ON `eventLikes`(`event_id`, `user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `eventTags_event_id_tag_id_key` ON `eventTags`(`event_id`, `tag_id`);

-- CreateIndex
CREATE UNIQUE INDEX `ratings_event_id_user_id_key` ON `ratings`(`event_id`, `user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `reviews_event_id_user_id_key` ON `reviews`(`event_id`, `user_id`);
