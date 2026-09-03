CREATE TABLE `discovery_bookmarks` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `target_kind` varchar(32) NOT NULL,
  `target_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `discovery_bookmarks_user_target_unique` (`user_id`, `target_kind`, `target_id`),
  UNIQUE KEY `discovery_bookmarks_user_created_at_index` (`user_id`, `created_at`, `id`),
  CONSTRAINT `discovery_bookmarks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `search_history` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `query` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `search_history_user_created_at_index` (`user_id`, `created_at`, `id`),
  CONSTRAINT `search_history_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
