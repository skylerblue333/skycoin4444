CREATE TABLE IF NOT EXISTS `arcade_game_progress` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `game_id` varchar(64) NOT NULL,
  `plays` int NOT NULL DEFAULT 0,
  `best_score` int NOT NULL DEFAULT 0,
  `best_combo` int NOT NULL DEFAULT 0,
  `total_sparks` int NOT NULL DEFAULT 0,
  `total_xp` int NOT NULL DEFAULT 0,
  `last_played_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `arcade_game_progress_user_game_unique` (`user_id`, `game_id`),
  KEY `arcade_game_progress_user_updated_idx` (`user_id`, `updated_at`),
  CONSTRAINT `arcade_game_progress_user_id_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
