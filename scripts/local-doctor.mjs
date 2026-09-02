import fs from "node:fs";
import net from "node:net";
import process from "node:process";
import { execFileSync } from "node:child_process";
import dotenv from "dotenv";

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? ".env.local" });

const checks = [];
const pass = (label, detail) => checks.push({ ok: true, label, detail });
const fail = (label, detail) => checks.push({ ok: false, label, detail });

function commandExists(command, args = ["--version"]) {
  try { return execFileSync(command, args, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { return null; }
}

const nodeVersion = commandExists("node");
nodeVersion ? pass("Node.js", nodeVersion) : fail("Node.js", "Install Node.js 22 or newer.");
const pnpmVersion = commandExists("pnpm");
pnpmVersion ? pass("pnpm", pnpmVersion) : fail("pnpm", "Install pnpm 11 or run corepack enable.");
const gitVersion = commandExists("git");
gitVersion ? pass("Git", gitVersion) : fail("Git", "Install Git and clone the repository again.");
const dockerVersion = commandExists("docker");
dockerVersion ? pass("Docker", dockerVersion) : fail("Docker", "Install Docker Desktop or Docker Engine with Compose; local MySQL cannot start without it.");

fs.existsSync(".env.local") ? pass("Environment file", ".env.local exists") : fail("Environment file", "Run: cp .env.local.example .env.local");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) fail("DATABASE_URL", "Set DATABASE_URL in .env.local.");
else {
  try {
    const parsed = new URL(databaseUrl);
    const database = parsed.pathname.replace(/^\//, "");
    if (!["127.0.0.1", "localhost", "::1"].includes(parsed.hostname) || !database.endsWith("_local")) fail("Database safety", "DATABASE_URL must point to localhost and a database ending in _local.");
    else pass("Database safety", `${parsed.hostname}:${parsed.port || 3306}/${database}`);
  } catch { fail("DATABASE_URL", "DATABASE_URL is not a valid mysql:// URL."); }
}

const port = Number(process.env.PORT || 3000);
await new Promise((resolve) => {
  const server = net.createServer();
  server.once("error", () => { pass("Port", `${port} is already in use; the server will select another available port.`); resolve(); });
  server.listen(port, "127.0.0.1", () => { pass("Port", `${port} is available.`); server.close(resolve); });
});

for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"} ${check.label}: ${check.detail}`);
const failures = checks.filter((check) => !check.ok).length;
if (failures) {
  console.error(`\n${failures} prerequisite(s) need attention before the local test phase.`);
  process.exitCode = 1;
} else {
  console.log("\nLocal prerequisites look ready. Run: pnpm local:up && pnpm local:db && pnpm dev:local");
}
