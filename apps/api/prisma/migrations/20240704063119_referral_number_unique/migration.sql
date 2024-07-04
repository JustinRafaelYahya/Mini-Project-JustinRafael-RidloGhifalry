/*
  Warnings:

  - A unique constraint covering the columns `[referral_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_referral_number_key` ON `users`(`referral_number`);
