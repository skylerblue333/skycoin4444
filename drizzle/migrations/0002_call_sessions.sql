CREATE TABLE IF NOT EXISTS `call_sessions` (
  `id` varchar(255) NOT NULL,
  `caller_id` varchar(255) NOT NULL,
  `callee_id` varchar(255) NOT NULL,
  `mode` varchar(16) NOT NULL,
  `status` varchar(24) NOT NULL DEFAULT 'ringing',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `answered_at` timestamp NULL,
  `ended_at` timestamp NULL,
  PRIMARY KEY (`id`),
  KEY `call_sessions_caller_idx` (`caller_id`, `created_at`),
  KEY `call_sessions_callee_idx` (`callee_id`, `created_at`),
  CONSTRAINT `call_sessions_caller_fk` FOREIGN KEY (`caller_id`) REFERENCES `users` (`id`),
  CONSTRAINT `call_sessions_callee_fk` FOREIGN KEY (`callee_id`) REFERENCES `users` (`id`)
);
