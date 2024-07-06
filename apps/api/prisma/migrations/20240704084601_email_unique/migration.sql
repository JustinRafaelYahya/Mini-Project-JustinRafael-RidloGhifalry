/*
  Warnings:

  - A unique constraint covering the columns `[referral_number,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `users_referral_number_key` ON `users`;

-- CreateIndex
CREATE UNIQUE INDEX `users_referral_number_email_key` ON `users`(`referral_number`, `email`);
