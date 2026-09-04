import { execFileSync } from "node:child_process";
import mysql from "mysql2/promise";

const CONFIRMATION = "EMPTY_BETA_DATABASE";
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (process.env.BETA_DB_BOOTSTRAP_CONFIRM !== CONFIRMATION) {
  throw new Error(
    `Refusing managed beta database bootstrap. Set BETA_DB_BOOTSTRAP_CONFIRM=${CONFIRMATION} only after verifying the target database is disposable and empty.`
  );
}

const parsed = new URL(databaseUrl);
if (parsed.protocol !== "mysql:") {
  throw new Error("Managed beta database bootstrap requires mysql:// DATABASE_URL");
}

if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
  throw new Error(
    "Managed beta database bootstrap refuses localhost. Use pnpm local:db for disposable local databases."
  );
}

const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
if (!database) {
  throw new Error("DATABASE_URL must include a database name");
}

const connection = await mysql.createConnection(databaseUrl);
const [existingTables] = await connection.query("SHOW TABLES");
if (Array.isArray(existingTables) && existingTables.length > 0) {
  await connection.end();
  throw new Error(
    `Refusing bootstrap because ${database} is not empty (${existingTables.length} table(s) found). Create a new empty beta database or use a reviewed forward migration.`
  );
}
await connection.end();

execFileSync("pnpm", ["exec", "drizzle-kit", "push", "--force"], {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: databaseUrl,
  },
});

const verification = await mysql.createConnection(databaseUrl);
for (const table of [
  "users",
  "beta_feedback",
  "course_progress",
  "posts",
  "audit_ledger",
]) {
  const [rows] = await verification.query("SHOW TABLES LIKE ?", [table]);
  if (!Array.isArray(rows) || rows.length !== 1) {
    await verification.end();
    throw new Error(
      `Canonical beta schema bootstrap did not create required table: ${table}`
    );
  }
}
await verification.end();

console.log(
  `Managed beta database bootstrap verified for ${parsed.hostname}/${database}. No seed users, balances, transactions, or provider data were created.`
);
