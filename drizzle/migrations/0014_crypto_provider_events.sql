CREATE TABLE `crypto_provider_events` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255),
  `provider` varchar(64) NOT NULL,
  `event_type` varchar(64) NOT NULL,
  `asset` varchar(32),
  `amount_atomic` varchar(255),
  `external_ref` varchar(255),
  `tx_hash` varchar(255),
  `status` varchar(64) NOT NULL DEFAULT 'observed',
  `metadata` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `crypto_provider_events_id` PRIMARY KEY(`id`),
  CONSTRAINT `crypto_provider_events_user_id_users_id_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE no action ON UPDATE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `crypto_provider_events_provider_external_unique`
  ON `crypto_provider_events` (`provider`, `external_ref`);
--> statement-breakpoint
CREATE INDEX `crypto_provider_events_user_created_idx`
  ON `crypto_provider_events` (`user_id`, `created_at`);
--> statement-breakpoint
CREATE INDEX `crypto_provider_events_tx_hash_idx`
  ON `crypto_provider_events` (`tx_hash`);
