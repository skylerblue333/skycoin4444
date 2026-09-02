CREATE TABLE IF NOT EXISTS `beta_feedback` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `category` varchar(64) NOT NULL,
  `severity` varchar(32) NOT NULL,
  `route` varchar(255) NOT NULL,
  `summary` varchar(255) NOT NULL,
  `details` text NOT NULL,
  `expected` text NOT NULL,
  `actual` text NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'received',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `beta_feedback_user_idx` (`user_id`),
  CONSTRAINT `beta_feedback_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
