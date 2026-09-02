ALTER TABLE `users`
  ADD COLUMN `profile_visibility` varchar(16) NOT NULL DEFAULT 'public';
