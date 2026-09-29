const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export const DEFAULT_RECOVERY_OBJECTIVES = Object.freeze({
  rpoHours: 24,
  rtoMinutes: 60,
});

export type MysqlRecoveryTarget = {
  hostname: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

type ParseRecoveryTargetOptions = {
  allowLocalhost?: boolean;
};

export function parseMysqlRecoveryTarget(
  raw: string,
  options: ParseRecoveryTargetOptions = {},
): MysqlRecoveryTarget {
  const value = raw.trim();
  if (!value) {
    throw new Error("MySQL recovery URL is required");
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("MySQL recovery URL is malformed");
  }

  if (parsed.protocol !== "mysql:") {
    throw new Error("Database recovery requires a mysql:// URL");
  }
  if (parsed.hash) {
    throw new Error("Database recovery URL must not contain a fragment");
  }
  if (!options.allowLocalhost && LOCAL_HOSTS.has(parsed.hostname.toLowerCase())) {
    throw new Error(
      "Managed beta database recovery refuses localhost targets by default",
    );
  }

  let username: string;
  let password: string;
  let database: string;
  try {
    username = decodeURIComponent(parsed.username);
    password = decodeURIComponent(parsed.password);
    database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
  } catch {
    throw new Error("Database recovery URL contains invalid percent-encoding");
  }

  if (!parsed.hostname) {
    throw new Error("Database recovery URL must include a hostname");
  }
  if (!username) {
    throw new Error("Database recovery URL must include a username");
  }
  if (!database || database.includes("/")) {
    throw new Error("Database recovery URL must include exactly one database name");
  }

  const port = parsed.port ? Number(parsed.port) : 3306;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Database recovery URL contains an invalid port");
  }

  return {
    hostname: parsed.hostname,
    port,
    username,
    password,
    database,
  };
}

function endpointIdentity(target: MysqlRecoveryTarget) {
  return `${target.hostname.toLowerCase()}:${target.port}/${target.database.toLowerCase()}`;
}

export function assertDistinctRecoveryTargets(
  source: MysqlRecoveryTarget,
  restore: MysqlRecoveryTarget,
) {
  if (endpointIdentity(source) === endpointIdentity(restore)) {
    throw new Error(
      "Restore target must be a different database from the source database",
    );
  }
}

export function assertDisposableRestoreTarget(
  target: MysqlRecoveryTarget,
  requiredPrefix = "skycoin_restore_",
) {
  const prefix = requiredPrefix.trim().toLowerCase();
  if (!prefix) {
    throw new Error("Restore target prefix must not be empty");
  }
  if (!target.database.toLowerCase().startsWith(prefix)) {
    throw new Error(
      `Restore database must start with ${requiredPrefix} to prove it is disposable`,
    );
  }
}

function quoteOptionValue(value: string) {
  if (/[\u0000\r\n]/u.test(value)) {
    throw new Error("MySQL client option values must not contain control lines");
  }
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export function buildMysqlDefaultsFile(target: MysqlRecoveryTarget) {
  return [
    "[client]",
    `host=${quoteOptionValue(target.hostname)}`,
    `port=${target.port}`,
    `user=${quoteOptionValue(target.username)}`,
    `password=${quoteOptionValue(target.password)}`,
    "protocol=tcp",
    "",
  ].join("\n");
}

export function normalizeTableNames(rows: unknown) {
  if (!Array.isArray(rows)) {
    throw new Error("SHOW TABLES returned an invalid result");
  }

  const names = rows.map(row => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      throw new Error("SHOW TABLES returned an invalid row");
    }
    const values = Object.values(row);
    if (values.length !== 1 || typeof values[0] !== "string" || !values[0]) {
      throw new Error("SHOW TABLES returned an invalid table name");
    }
    return values[0];
  });

  const unique = new Set(names);
  if (unique.size !== names.length) {
    throw new Error("SHOW TABLES returned duplicate table names");
  }

  return [...unique].sort((left, right) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
}

export function assertMatchingTableSets(expected: string[], actual: string[]) {
  const left = [...expected].sort();
  const right = [...actual].sort();
  if (
    left.length !== right.length ||
    left.some((name, index) => name !== right[index])
  ) {
    throw new Error(
      `Restored table set does not match backup manifest (expected ${left.length}, got ${right.length})`,
    );
  }
}

export function assertRequiredRecoveryTables(tables: string[]) {
  for (const table of [
    "users",
    "beta_feedback",
    "course_progress",
    "posts",
    "audit_ledger",
  ]) {
    if (!tables.includes(table)) {
      throw new Error(`Recovery verification is missing required table: ${table}`);
    }
  }
}

export function parsePositiveNumber(
  raw: string | undefined,
  fallback: number,
  name: string,
) {
  const value = raw === undefined || raw.trim() === "" ? fallback : Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
  return value;
}

export function resolveReleaseSha(
  candidates: Array<string | undefined>,
): string | null {
  for (const candidate of candidates) {
    const value = candidate?.trim().toLowerCase();
    if (value && /^[0-9a-f]{7,40}$/u.test(value)) {
      return value;
    }
  }
  return null;
}
