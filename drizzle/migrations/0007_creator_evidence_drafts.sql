CREATE TABLE `creator_evidence_drafts` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `title` varchar(120) NOT NULL,
  `brief` text NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `creator_evidence_drafts_user_updated_at_index` (`user_id`, `updated_at`, `id`),
  CONSTRAINT `creator_evidence_drafts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
