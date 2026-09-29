import mysql from "mysql2/promise";

const CONFIRMATION = "LANGUAGE_EXCHANGE_V1";
const REQUIRED_COLUMNS = [
  "user_id",
  "native_language",
  "learning_language",
  "level",
  "session_minutes",
  "availability",
  "goals",
  "topics",
  "correction_preference",
  "discoverable",
  "created_at",
  "updated_at",
];

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("DATABASE_URL is required");

if (process.env.BETA_DB_MIGRATION_CONFIRM !== CONFIRMATION) {
  throw new Error(
    `Refusing language exchange migration. Set BETA_DB_MIGRATION_CONFIRM=${CONFIRMATION} for this reviewed additive migration only.`
  );
}

const parsed = new URL(databaseUrl);
if (parsed.protocol !== "mysql:") {
  throw new Error("Language exchange migration requires mysql:// DATABASE_URL");
}
if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
  throw new Error(
    "Language exchange production migration refuses localhost; use local:db for disposable development databases."
  );
}

const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
if (!database) throw new Error("DATABASE_URL must include a database name");

const connection = await mysql.createConnection(databaseUrl);
try {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS language_exchange_profiles (
      user_id varchar(255) NOT NULL,
      native_language varchar(64) NOT NULL,
      learning_language varchar(64) NOT NULL,
      level varchar(4) NOT NULL,
      session_minutes int NOT NULL DEFAULT 45,
      availability varchar(255) NULL,
      goals varchar(500) NOT NULL,
      topics varchar(500) NULL,
      correction_preference varchar(32) NOT NULL DEFAULT 'ask-first',
      discoverable boolean NOT NULL DEFAULT false,
      created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id),
      KEY language_exchange_profiles_pair_idx
        (native_language, learning_language, discoverable),
      CONSTRAINT language_exchange_profiles_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
    )
  `);

  const [columns] = await connection.query(
    "SHOW COLUMNS FROM language_exchange_profiles"
  );
  const names = new Set(
    Array.isArray(columns) ? columns.map(row => String(row.Field)) : []
  );
  for (const column of REQUIRED_COLUMNS) {
    if (!names.has(column)) {
      throw new Error(
        `language_exchange_profiles verification failed: missing column ${column}`
      );
    }
  }

  const [indexes] = await connection.query(
    "SHOW INDEX FROM language_exchange_profiles"
  );
  const indexNames = new Set(
    Array.isArray(indexes) ? indexes.map(row => String(row.Key_name)) : []
  );
  for (const indexName of ["PRIMARY", "language_exchange_profiles_pair_idx"]) {
    if (!indexNames.has(indexName)) {
      throw new Error(
        `language_exchange_profiles verification failed: missing index ${indexName}`
      );
    }
  }

  const [foreignKeys] = await connection.query(
    `SELECT CONSTRAINT_NAME
       FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'language_exchange_profiles'
        AND COLUMN_NAME = 'user_id'
        AND REFERENCED_TABLE_NAME = 'users'
        AND REFERENCED_COLUMN_NAME = 'id'`,
    [database]
  );
  if (!Array.isArray(foreignKeys) || foreignKeys.length < 1) {
    throw new Error(
      "language_exchange_profiles verification failed: user_id foreign key is missing"
    );
  }

  console.log(
    `Language exchange migration verified for ${parsed.hostname}/${database}. Existing users and application data were not modified.`
  );
} finally {
  await connection.end();
}
