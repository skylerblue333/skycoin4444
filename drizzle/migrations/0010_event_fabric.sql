CREATE TABLE IF NOT EXISTS `event_outbox` (
  `id` varchar(255) NOT NULL,
  `event_type` varchar(160) NOT NULL,
  `schema_version` int NOT NULL,
  `producer` varchar(160) NOT NULL,
  `aggregate_type` varchar(128) NOT NULL,
  `aggregate_id` varchar(255) NOT NULL,
  `correlation_id` varchar(255) NOT NULL,
  `causation_id` varchar(255) NULL,
  `actor_id` varchar(255) NULL,
  `idempotency_key` varchar(255) NULL,
  `payload` text NOT NULL,
  `metadata` text NULL,
  `state` varchar(32) NOT NULL DEFAULT 'pending',
  `attempts` int NOT NULL DEFAULT 0,
  `available_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `leased_until` timestamp NULL,
  `published_at` timestamp NULL,
  `last_error` text NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_outbox_event_idempotency_unique` (`event_type`, `idempotency_key`)
);

CREATE TABLE IF NOT EXISTS `idempotency_records` (
  `id` varchar(255) NOT NULL,
  `scope` varchar(128) NOT NULL,
  `idempotency_key` varchar(255) NOT NULL,
  `request_hash` varchar(64) NOT NULL,
  `state` varchar(32) NOT NULL DEFAULT 'in_progress',
  `resource_id` varchar(255) NULL,
  `response_status` int NULL,
  `response_body` text NULL,
  `expires_at` timestamp NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idempotency_records_scope_key_unique` (`scope`, `idempotency_key`)
);
