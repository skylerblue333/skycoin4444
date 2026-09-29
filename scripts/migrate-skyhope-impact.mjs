import mysql from "mysql2/promise";

const CONFIRMATION = "SKYHOPE_IMPACT_V1";
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) throw new Error("DATABASE_URL is required");

if (process.env.BETA_DB_MIGRATION_CONFIRM !== CONFIRMATION) {
  throw new Error(
    `Refusing SkyHope impact migration. Set BETA_DB_MIGRATION_CONFIRM=${CONFIRMATION} for this reviewed additive migration only.`
  );
}

const parsed = new URL(databaseUrl);
if (parsed.protocol !== "mysql:") {
  throw new Error("SkyHope impact migration requires mysql:// DATABASE_URL");
}
if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
  throw new Error(
    "SkyHope impact production migration refuses localhost; use local:db for disposable development databases."
  );
}

const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
if (!database) throw new Error("DATABASE_URL must include a database name");

const connection = await mysql.createConnection(databaseUrl);
try {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS charity_pledges (
      id varchar(255) NOT NULL,
      user_id varchar(255) NOT NULL,
      campaign_id varchar(120) NOT NULL,
      amount_minor int NOT NULL,
      currency varchar(3) NOT NULL,
      status varchar(32) NOT NULL DEFAULT 'pledged',
      idempotency_key varchar(128) NOT NULL,
      created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY charity_pledges_user_idempotency_unique (user_id, idempotency_key),
      KEY charity_pledges_user_created_idx (user_id, created_at),
      KEY charity_pledges_campaign_created_idx (campaign_id, created_at),
      CONSTRAINT charity_pledges_user_id_fk
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS charity_volunteer_actions (
      id varchar(255) NOT NULL,
      user_id varchar(255) NOT NULL,
      campaign_id varchar(120),
      action_type varchar(64) NOT NULL,
      minutes int NOT NULL,
      note varchar(255),
      created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY charity_volunteer_actions_user_created_idx (user_id, created_at),
      KEY charity_volunteer_actions_campaign_created_idx (campaign_id, created_at),
      CONSTRAINT charity_volunteer_actions_user_id_fk
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  const requirements = [
    {
      table: "charity_pledges",
      columns: ["id", "user_id", "campaign_id", "amount_minor", "currency", "status", "idempotency_key", "created_at"],
      indexes: ["PRIMARY", "charity_pledges_user_idempotency_unique", "charity_pledges_user_created_idx", "charity_pledges_campaign_created_idx"],
    },
    {
      table: "charity_volunteer_actions",
      columns: ["id", "user_id", "campaign_id", "action_type", "minutes", "note", "created_at"],
      indexes: ["PRIMARY", "charity_volunteer_actions_user_created_idx", "charity_volunteer_actions_campaign_created_idx"],
    },
  ];

  for (const requirement of requirements) {
    const [columns] = await connection.query(`SHOW COLUMNS FROM \`${requirement.table}\``);
    const columnNames = new Set(
      Array.isArray(columns) ? columns.map(row => String(row.Field)) : []
    );
    for (const column of requirement.columns) {
      if (!columnNames.has(column)) {
        throw new Error(`${requirement.table} verification failed: missing column ${column}`);
      }
    }

    const [indexes] = await connection.query(`SHOW INDEX FROM \`${requirement.table}\``);
    const indexNames = new Set(
      Array.isArray(indexes) ? indexes.map(row => String(row.Key_name)) : []
    );
    for (const indexName of requirement.indexes) {
      if (!indexNames.has(indexName)) {
        throw new Error(`${requirement.table} verification failed: missing index ${indexName}`);
      }
    }

    const [foreignKeys] = await connection.query(
      `SELECT CONSTRAINT_NAME
         FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = ?
          AND TABLE_NAME = ?
          AND COLUMN_NAME = 'user_id'
          AND REFERENCED_TABLE_NAME = 'users'
          AND REFERENCED_COLUMN_NAME = 'id'`,
      [database, requirement.table]
    );
    if (!Array.isArray(foreignKeys) || foreignKeys.length < 1) {
      throw new Error(
        `${requirement.table} verification failed: user_id foreign key is missing`
      );
    }
  }

  console.log(
    `SkyHope impact migration verified for ${parsed.hostname}/${database}. Existing users and application rows were not modified.`
  );
} finally {
  await connection.end();
}
