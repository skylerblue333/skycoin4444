CREATE TABLE IF NOT EXISTS `communities` (
  `id` varchar(255) NOT NULL,
  `owner_id` varchar(255) NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` varchar(255),
  `category` varchar(80) DEFAULT 'General',
  `visibility` varchar(20) NOT NULL DEFAULT 'public',
  `member_count` int NOT NULL DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `communities_owner_idx` (`owner_id`),
  CONSTRAINT `communities_owner_fk` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
);

CREATE TABLE IF NOT EXISTS `community_members` (
  `id` varchar(255) NOT NULL,
  `community_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'member',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `community_member_unique` (`community_id`, `user_id`),
  KEY `community_members_user_idx` (`user_id`),
  CONSTRAINT `community_members_community_fk` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `community_members_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
