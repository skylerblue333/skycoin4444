import dotenv from "dotenv";
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? ".env.local" });
import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required. Copy .env.local.example to .env.local first.");

const parsed = new URL(databaseUrl);
const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
const host = parsed.hostname;
const port = Number(parsed.port || 3306);
const user = decodeURIComponent(parsed.username);
const password = decodeURIComponent(parsed.password);

if (!["127.0.0.1", "localhost", "::1"].includes(host) || !database.endsWith("_local")) {
  throw new Error("Refusing local database operations unless DATABASE_URL points to localhost and a database ending in _local.");
}

const root = await mysql.createConnection({ host, port, user, password, database });
const command = process.argv[2] ?? "migrate";
const migrationPaths = [
  path.resolve("drizzle/0000_crazy_the_professor.sql"),
  ...(await fs.readdir(path.resolve("drizzle/migrations"))).filter((file) => file.endsWith(".sql")).sort().map((file) => path.resolve("drizzle/migrations", file)),
];

if (command === "reset") {
  await root.query("SET FOREIGN_KEY_CHECKS = 0");
  const [tables] = await root.query("SHOW TABLES");
  for (const row of tables) {
    const tableName = Object.values(row)[0];
    await root.query(`DROP TABLE IF EXISTS \`${String(tableName).replaceAll("`", "") }\``);
  }
  await root.query("SET FOREIGN_KEY_CHECKS = 1");
}

if (!["migrate", "reset"].includes(command)) throw new Error("Usage: node scripts/local-db.mjs [migrate|reset]");

for (const migrationPath of migrationPaths) {
  const sql = await fs.readFile(migrationPath, "utf8");
  for (const statement of sql.split(/;\s*(?:\n|$)/).map((item) => item.trim()).filter(Boolean)) {
    await root.query(statement);
  }
}

await root.query(
  `INSERT INTO users (id, open_id, email, username, name, bio, profile_visibility, role, verified)
   VALUES ('local-test-user', 'local-test-user', 'local@example.invalid', 'local_tester', 'Local Test User', 'Development-only test account', 'public', 'user', false)
   ON DUPLICATE KEY UPDATE name = VALUES(name), bio = VALUES(bio), profile_visibility = VALUES(profile_visibility)`,
);

console.log(`Local database ready: ${database} (${command})`);
await root.end();
