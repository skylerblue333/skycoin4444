import mysql from "mysql2/promise";

const CONFIRMATION = "ARCADE_PROGRESS_V1";
const REQUIRED_COLUMNS = [
  "id",
  "user_id",
  "game_id",
  "plays",
  "best_score",
  "best_combo",
  "total_sparks",
  "total_xp",
  "last_played_at",
  "updated_at",
];

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("DATABASE_URL is required");

if (process.env.BETA_DB_MIGRATION_CONFIRM !== CONFIRMATION) {
  throw new Error(
    `Refusing arcade progress migration. Set BETA_DB_MIGRATION_CONFIRM=${CONFIRMATION} for this reviewed additive migration only.`
  );
}

const parsed = new URL(databaseUrl);
if (parsed.protocol !== "mysql:") {
  throw new Error("Arcade progress migration requires mysql:// DATABASE_URL");
}
if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
  throw new Error(
    "Arcade progress production migration refuses localhost; use local:db for disposable development databases."
  );
}

const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
if (!database) throw new Error("DATABASE_URL must include a database name");

const connection = await mysql.createConnection(databaseUrl);
try {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS arcade_game_progress (
      id varchar(255) NOT NULL,
      user_id varchar(255) NOT NULL,
      game_id varchar(64) NOT NULL,
      plays int NOT NULL DEFAULT 0,
      best_score int NOT NULL DEFAULT 0,
      best_combo int NOT NULL DEFAULT 0,
      total_sparks int NOT NULL DEFAULT 0,
      total_xp int NOT NULL DEFAULT 0,
      last_played_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY arcade_game_progress_user_game_unique (user_id, game_id),
      KEY arcade_game_progress_user_updated_idx (user_id, updated_at),
      CONSTRAINT arcade_game_progress_user_id_fk
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  const [columns] = await connection.query(
    "SHOW COLUMNS FROM arcade_game_progress"
  );
  const names = new Set(
    Array.isArray(columns)
      ? columns.map(row => String(row.Field))
      : []
  );
  for (const column of REQUIRED_COLUMNS) {
    if (!names.has(column)) {
      throw new Error(
        `arcade_game_progress verification failed: missing column ${column}`
      );
    }
  }

  const [indexes] = await connection.query(
    "SHOW INDEX FROM arcade_game_progress"
  );
  const indexNames = new Set(
    Array.isArray(indexes)
      ? indexes.map(row => String(row.Key_name))
      : []
  );
  for (const indexName of [
    "PRIMARY",
    "arcade_game_progress_user_game_unique",
    "arcade_game_progress_user_updated_idx",
  ]) {
    if (!indexNames.has(indexName)) {
      throw new Error(
        `arcade_game_progress verification failed: missing index ${indexName}`
      );
    }
  }

  console.log(
    `Arcade progress migration verified for ${parsed.hostname}/${database}. Existing users and application data were not modified.`
  );
} finally {
  await connection.end();
}
