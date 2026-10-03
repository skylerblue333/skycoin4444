CREATE TABLE `charity_pledges` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `campaign_id` varchar(120) NOT NULL,
  `amount_minor` int NOT NULL,
  `currency` varchar(3) NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'pledged',
  `idempotency_key` varchar(128) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `charity_pledges_id` PRIMARY KEY(`id`),
  CONSTRAINT `charity_pledges_user_id_users_id_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE no action ON UPDATE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `charity_pledges_user_idempotency_unique`
  ON `charity_pledges` (`user_id`, `idempotency_key`);
--> statement-breakpoint
CREATE INDEX `charity_pledges_user_created_idx`
  ON `charity_pledges` (`user_id`, `created_at`);
--> statement-breakpoint
CREATE INDEX `charity_pledges_campaign_created_idx`
  ON `charity_pledges` (`campaign_id`, `created_at`);
--> statement-breakpoint
CREATE TABLE `charity_volunteer_actions` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `campaign_id` varchar(120),
  `action_type` varchar(64) NOT NULL,
  `minutes` int NOT NULL,
  `note` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `charity_volunteer_actions_id` PRIMARY KEY(`id`),
  CONSTRAINT `charity_volunteer_actions_user_id_users_id_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE no action ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX `charity_volunteer_actions_user_created_idx`
  ON `charity_volunteer_actions` (`user_id`, `created_at`);
--> statement-breakpoint
CREATE INDEX `charity_volunteer_actions_campaign_created_idx`
  ON `charity_volunteer_actions` (`campaign_id`, `created_at`);
