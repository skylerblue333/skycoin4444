CREATE TABLE IF NOT EXISTS language_exchange_profiles (
  user_id VARCHAR(255) NOT NULL,
  native_language VARCHAR(64) NOT NULL,
  learning_language VARCHAR(64) NOT NULL,
  level VARCHAR(4) NOT NULL,
  session_minutes INT NOT NULL DEFAULT 45,
  availability VARCHAR(255) NULL,
  goals VARCHAR(500) NOT NULL,
  topics VARCHAR(500) NULL,
  correction_preference VARCHAR(32) NOT NULL DEFAULT 'ask-first',
  discoverable BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT language_exchange_profiles_user_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX language_exchange_profiles_pair_idx
  ON language_exchange_profiles (native_language, learning_language, discoverable);
