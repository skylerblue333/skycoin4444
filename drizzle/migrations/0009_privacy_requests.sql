CREATE TABLE `privacy_requests` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `action` varchar(32) NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'requested',
  `reason` text,
  `operator_note` text,
  `requested_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `privacy_requests_user_requested_at_index` (`user_id`, `requested_at`, `id`),
  CONSTRAINT `privacy_requests_user_id_users_id_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
