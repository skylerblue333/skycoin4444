ALTER TABLE event_outbox
  ADD COLUMN lease_owner varchar(64) NULL AFTER leased_until;

CREATE INDEX event_outbox_dispatch_idx
  ON event_outbox (state, available_at, leased_until);

CREATE TABLE event_consumer_receipts (
  id varchar(255) NOT NULL,
  event_id varchar(255) NOT NULL,
  consumer varchar(128) NOT NULL,
  event_type varchar(160) NOT NULL,
  processed_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY event_consumer_receipts_event_consumer_unique (event_id, consumer)
);
