CREATE TABLE `notification_preferences` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `in_app_enabled` boolean NOT NULL DEFAULT true,
  `product_updates_enabled` boolean NOT NULL DEFAULT false,
  `security_alerts_enabled` boolean NOT NULL DEFAULT true,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notification_preferences_user_unique` (`user_id`),
  CONSTRAINT `notification_preferences_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
