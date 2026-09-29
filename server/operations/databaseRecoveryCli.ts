import { createHash } from "node:crypto";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { createGunzip, createGzip } from "node:zlib";
import mysql from "mysql2/promise";
import {
  DEFAULT_RECOVERY_OBJECTIVES,
  assertDisposableRestoreTarget,
  assertDistinctRecoveryTargets,
  assertMatchingTableSets,
  assertRequiredRecoveryTables,
  buildMysqlDefaultsFile,
  normalizeTableNames,
  parseMysqlRecoveryTarget,
  parsePositiveNumber,
  resolveReleaseSha,
  type MysqlRecoveryTarget,
} from "./databaseRecovery";

const BACKUP_CONFIRMATION = "BACKUP_MANAGED_BETA";
const RESTORE_CONFIRMATION = "RESTORE_DISPOSABLE_BETA";
const BACKUP_CONTRACT = "skycoin4444.database-backup.v1";
const RESTORE_CONTRACT = "skycoin4444.database-restore-drill.v1";
const MAX_STDERR_BYTES = 32_768;

type BackupManifest = {
  contract: typeof BACKUP_CONTRACT;
  createdAt: string;
  releaseSha: string | null;
  artifact: {
    fileName: string;
    bytes: number;
    sha256: string;
  };
  source: {
    engine: "mysql";
    tableCount: number;
    tables: string[];
  };
  objectives: {
    rpoHours: number;
    rtoMinutes: number;
  };
  limitations: string[];
};

function timestampSlug(date = new Date()) {
  return date.toISOString().replace(/[:.]/gu, "-");
}

function artifactDirectory() {
  return path.resolve(
    process.env.BETA_DB_RECOVERY_ARTIFACT_DIR?.trim() ||
      "artifacts/database-recovery",
  );
}

function recoveryObjectives() {
  return {
    rpoHours: parsePositiveNumber(
      process.env.BETA_RECOVERY_RPO_HOURS,
      DEFAULT_RECOVERY_OBJECTIVES.rpoHours,
      "BETA_RECOVERY_RPO_HOURS",
    ),
    rtoMinutes: parsePositiveNumber(
      process.env.BETA_RECOVERY_RTO_MINUTES,
      DEFAULT_RECOVERY_OBJECTIVES.rtoMinutes,
      "BETA_RECOVERY_RTO_MINUTES",
    ),
  };
}

function redactError(message: string, targets: MysqlRecoveryTarget[]) {
  let redacted = message;
  for (const target of targets) {
    for (const secret of [target.username, target.password]) {
      if (secret) {
        redacted = redacted.split(secret).join("[redacted]");
      }
    }
  }
  return redacted;
}

function createMysqlOptionFile(target: MysqlRecoveryTarget) {
  const directory = mkdtempSync(path.join(tmpdir(), "skycoin4444-recovery-"));
  const file = path.join(directory, "client.cnf");
  writeFileSync(file, buildMysqlDefaultsFile(target), {
    encoding: "utf8",
    mode: 0o600,
  });
  return {
    file,
    cleanup: () => rmSync(directory, { recursive: true, force: true }),
  };
}

async function waitForProcess(
  child: ReturnType<typeof spawn>,
  label: string,
  targets: MysqlRecoveryTarget[],
) {
  let stderr = "";
  child.stderr?.setEncoding("utf8");
  child.stderr?.on("data", chunk => {
    if (stderr.length < MAX_STDERR_BYTES) {
      stderr += String(chunk).slice(0, MAX_STDERR_BYTES - stderr.length);
    }
  });

  await new Promise<void>((resolve, reject) => {
    child.once("error", reject);
    child.once("close", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `${label} exited with code ${String(code)}${stderr.trim() ? `: ${redactError(stderr.trim(), targets)}` : ""}`,
          ),
        );
      }
    });
  });
}

async function listTables(databaseUrl: string) {
  const connection = await mysql.createConnection(databaseUrl);
  try {
    const [rows] = await connection.query("SHOW TABLES");
    return normalizeTableNames(rows);
  } finally {
    await connection.end();
  }
}

async function sha256File(file: string) {
  const hash = createHash("sha256");
  await pipeline(createReadStream(file), hash);
  return hash.digest("hex");
}

function validateBackupManifest(value: unknown): BackupManifest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Backup manifest is not an object");
  }
  const manifest = value as Partial<BackupManifest>;
  if (
    manifest.contract !== BACKUP_CONTRACT ||
    typeof manifest.createdAt !== "string" ||
    !manifest.artifact ||
    typeof manifest.artifact.fileName !== "string" ||
    typeof manifest.artifact.bytes !== "number" ||
    !Number.isSafeInteger(manifest.artifact.bytes) ||
    manifest.artifact.bytes <= 0 ||
    typeof manifest.artifact.sha256 !== "string" ||
    !/^[0-9a-f]{64}$/u.test(manifest.artifact.sha256) ||
    !manifest.source ||
    manifest.source.engine !== "mysql" ||
    !Array.isArray(manifest.source.tables) ||
    !manifest.source.tables.every(
      table => typeof table === "string" && table.length > 0,
    ) ||
    typeof manifest.source.tableCount !== "number" ||
    manifest.source.tableCount !== manifest.source.tables.length ||
    !manifest.objectives ||
    typeof manifest.objectives.rpoHours !== "number" ||
    typeof manifest.objectives.rtoMinutes !== "number"
  ) {
    throw new Error("Backup manifest failed contract validation");
  }
  return manifest as BackupManifest;
}

function readBackupManifest(file: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    throw new Error("Backup manifest is not valid JSON");
  }
  return validateBackupManifest(parsed);
}

async function backup() {
  if (process.env.BETA_DB_BACKUP_CONFIRM !== BACKUP_CONFIRMATION) {
    throw new Error(
      `Refusing managed beta backup. Set BETA_DB_BACKUP_CONFIRM=${BACKUP_CONFIRMATION} only for an approved read-only backup run.`,
    );
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for backup");
  }

  const source = parseMysqlRecoveryTarget(databaseUrl);
  const tables = await listTables(databaseUrl);
  assertRequiredRecoveryTables(tables);

  const directory = artifactDirectory();
  mkdirSync(directory, { recursive: true });

  const configuredOutput = process.env.BETA_DB_BACKUP_FILE?.trim();
  const backupFile = path.resolve(
    configuredOutput ||
      path.join(directory, `skycoin4444-${timestampSlug()}.sql.gz`),
  );
  const manifestFile = `${backupFile}.manifest.json`;
  const partialFile = `${backupFile}.partial`;

  for (const file of [backupFile, manifestFile, partialFile]) {
    if (existsSync(file)) {
      throw new Error(`Refusing to overwrite existing recovery artifact: ${file}`);
    }
  }

  mkdirSync(path.dirname(backupFile), { recursive: true });
  const option = createMysqlOptionFile(source);
  try {
    const child = spawn(
      "mysqldump",
      [
        `--defaults-extra-file=${option.file}`,
        "--single-transaction",
        "--quick",
        "--hex-blob",
        "--routines",
        "--triggers",
        "--events",
        "--no-tablespaces",
        source.database,
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );

    if (!child.stdout) {
      throw new Error("mysqldump stdout is unavailable");
    }

    await Promise.all([
      pipeline(
        child.stdout,
        createGzip({ level: 9 }),
        createWriteStream(partialFile, { flags: "wx", mode: 0o600 }),
      ),
      waitForProcess(child, "mysqldump", [source]),
    ]);
    renameSync(partialFile, backupFile);
  } catch (error) {
    rmSync(partialFile, { force: true });
    throw error;
  } finally {
    option.cleanup();
  }

  const bytes = statSync(backupFile).size;
  if (bytes <= 0) {
    rmSync(backupFile, { force: true });
    throw new Error("Backup artifact is empty");
  }

  const sha256 = await sha256File(backupFile);
  const manifest: BackupManifest = {
    contract: BACKUP_CONTRACT,
    createdAt: new Date().toISOString(),
    releaseSha: resolveReleaseSha([
      process.env.BETA_RELEASE_SHA,
      process.env.RAILWAY_GIT_COMMIT_SHA,
      process.env.GITHUB_SHA,
    ]),
    artifact: {
      fileName: path.basename(backupFile),
      bytes,
      sha256,
    },
    source: {
      engine: "mysql",
      tableCount: tables.length,
      tables,
    },
    objectives: recoveryObjectives(),
    limitations: [
      "backup creation alone does not prove recoverability",
      "credentials and database host/name are intentionally excluded from evidence",
      "RPO/RTO values are engineering-beta objectives, not availability guarantees",
      "a restore drill against a disposable empty database is required before this artifact is called recovery-verified",
    ],
  };

  writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n", {
    encoding: "utf8",
    mode: 0o600,
    flag: "wx",
  });

  console.log(
    "DATABASE_BACKUP_CREATED " +
      JSON.stringify({
        contract: manifest.contract,
        fileName: manifest.artifact.fileName,
        bytes: manifest.artifact.bytes,
        sha256: manifest.artifact.sha256,
        tableCount: manifest.source.tableCount,
        releaseSha: manifest.releaseSha,
      }),
  );
}

async function restoreDrill() {
  if (process.env.BETA_DB_RESTORE_CONFIRM !== RESTORE_CONFIRMATION) {
    throw new Error(
      `Refusing restore drill. Set BETA_DB_RESTORE_CONFIRM=${RESTORE_CONFIRMATION} only for a pre-created disposable empty restore database.`,
    );
  }

  const sourceUrl = process.env.DATABASE_URL?.trim();
  const restoreUrl = process.env.RESTORE_DATABASE_URL?.trim();
  const backupRaw = process.env.BETA_DB_BACKUP_FILE?.trim();
  if (!sourceUrl) {
    throw new Error("DATABASE_URL is required to protect the source database");
  }
  if (!restoreUrl) {
    throw new Error("RESTORE_DATABASE_URL is required for restore drill");
  }
  if (!backupRaw) {
    throw new Error("BETA_DB_BACKUP_FILE is required for restore drill");
  }

  const source = parseMysqlRecoveryTarget(sourceUrl);
  const restore = parseMysqlRecoveryTarget(restoreUrl, {
    allowLocalhost: process.env.BETA_DB_RESTORE_ALLOW_LOCALHOST === "1",
  });
  assertDistinctRecoveryTargets(source, restore);
  assertDisposableRestoreTarget(
    restore,
    process.env.BETA_DB_RESTORE_DATABASE_PREFIX?.trim() || "skycoin_restore_",
  );

  const backupFile = path.resolve(backupRaw);
  const manifestFile = path.resolve(
    process.env.BETA_DB_BACKUP_MANIFEST?.trim() ||
      `${backupFile}.manifest.json`,
  );
  if (!existsSync(backupFile) || !existsSync(manifestFile)) {
    throw new Error("Backup artifact and manifest must both exist");
  }

  const manifest = readBackupManifest(manifestFile);
  if (path.basename(backupFile) !== manifest.artifact.fileName) {
    throw new Error("Backup filename does not match its manifest");
  }
  if (statSync(backupFile).size !== manifest.artifact.bytes) {
    throw new Error("Backup size does not match its manifest");
  }
  const actualSha = await sha256File(backupFile);
  if (actualSha !== manifest.artifact.sha256) {
    throw new Error("Backup SHA-256 does not match its manifest");
  }

  const beforeTables = await listTables(restoreUrl);
  if (beforeTables.length !== 0) {
    throw new Error(
      `Restore drill target is not empty (${beforeTables.length} table(s) found)`,
    );
  }

  const startedAt = new Date();
  const started = performance.now();
  const option = createMysqlOptionFile(restore);
  try {
    const child = spawn(
      "mysql",
      [`--defaults-extra-file=${option.file}`, restore.database],
      { stdio: ["pipe", "ignore", "pipe"] },
    );
    if (!child.stdin) {
      throw new Error("mysql stdin is unavailable");
    }

    await Promise.all([
      pipeline(createReadStream(backupFile), createGunzip(), child.stdin),
      waitForProcess(child, "mysql restore", [source, restore]),
    ]);
  } finally {
    option.cleanup();
  }

  const restoredTables = await listTables(restoreUrl);
  assertMatchingTableSets(manifest.source.tables, restoredTables);
  assertRequiredRecoveryTables(restoredTables);

  const finishedAt = new Date();
  const durationMs = performance.now() - started;
  const backupCreated = new Date(manifest.createdAt);
  if (Number.isNaN(backupCreated.getTime())) {
    throw new Error("Backup manifest createdAt is invalid");
  }

  const backupAgeHours =
    (startedAt.getTime() - backupCreated.getTime()) / (60 * 60 * 1000);
  if (backupAgeHours < 0) {
    throw new Error("Backup manifest timestamp is in the future");
  }

  const objectives = recoveryObjectives();
  const restoreMinutes = durationMs / 60_000;
  const rpoMet = backupAgeHours <= objectives.rpoHours;
  const rtoMet = restoreMinutes <= objectives.rtoMinutes;

  const evidence = {
    contract: RESTORE_CONTRACT,
    verifiedAt: finishedAt.toISOString(),
    releaseSha: manifest.releaseSha,
    backup: {
      fileName: manifest.artifact.fileName,
      sha256: manifest.artifact.sha256,
      createdAt: manifest.createdAt,
      ageHours: Number(backupAgeHours.toFixed(3)),
    },
    restore: {
      disposableTargetVerified: true,
      targetWasEmpty: true,
      tableCount: restoredTables.length,
      exactTableSetMatched: true,
      requiredTablesPresent: true,
      durationMs: Number(durationMs.toFixed(2)),
    },
    objectives: {
      rpoHours: objectives.rpoHours,
      rtoMinutes: objectives.rtoMinutes,
      rpoMet,
      rtoMet,
    },
    limitations: [
      "this verifies logical MySQL dump restoration into one disposable database",
      "it does not prove provider snapshot recovery, point-in-time recovery, failover, or multi-region disaster recovery",
      "it does not certify availability or eliminate the need for scheduled recurring backup drills",
      "the disposable restored database is intentionally left intact for operator inspection and must be removed separately",
    ],
  };

  const directory = artifactDirectory();
  mkdirSync(directory, { recursive: true });
  const evidenceFile = path.join(
    directory,
    `restore-drill-${timestampSlug(finishedAt)}.json`,
  );
  writeFileSync(evidenceFile, JSON.stringify(evidence, null, 2) + "\n", {
    encoding: "utf8",
    mode: 0o600,
    flag: "wx",
  });

  console.log(
    "DATABASE_RESTORE_DRILL " +
      JSON.stringify({
        contract: evidence.contract,
        backupSha256: evidence.backup.sha256,
        tableCount: evidence.restore.tableCount,
        durationMs: evidence.restore.durationMs,
        rpoMet,
        rtoMet,
      }),
  );

  if (!rpoMet || !rtoMet) {
    throw new Error(
      `Recovery objective failure: RPO met=${String(rpoMet)}, RTO met=${String(rtoMet)}`,
    );
  }
}

async function main() {
  const command = process.argv[2];
  if (command === "backup") {
    await backup();
    return;
  }
  if (command === "restore-drill") {
    await restoreDrill();
    return;
  }
  throw new Error(
    "Usage: tsx server/operations/databaseRecoveryCli.ts <backup|restore-drill>",
  );
}

main().catch(error => {
  console.error(
    "Database recovery operation failed:",
    error instanceof Error ? error.message : String(error),
  );
  process.exitCode = 1;
});
