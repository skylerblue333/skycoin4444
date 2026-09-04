export type DatabasePoolRuntimeOptions = Readonly<{
  connectionLimit: number;
  maxIdle: number;
  idleTimeoutMs: number;
  queueLimit: number;
  connectTimeoutMs: number;
  keepAliveInitialDelayMs: number;
}>;

function boundedInteger(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number,
  label: string
): number {
  if (!raw?.trim()) return fallback;

  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(
      label + " must be an integer between " + min + " and " + max
    );
  }
  return value;
}

export function databasePoolOptionsFromEnv(
  env: NodeJS.ProcessEnv = process.env
): DatabasePoolRuntimeOptions {
  const connectionLimit = boundedInteger(
    env.DB_POOL_CONNECTION_LIMIT,
    10,
    1,
    100,
    "DB_POOL_CONNECTION_LIMIT"
  );
  const maxIdle = boundedInteger(
    env.DB_POOL_MAX_IDLE,
    connectionLimit,
    0,
    100,
    "DB_POOL_MAX_IDLE"
  );

  if (maxIdle > connectionLimit) {
    throw new RangeError(
      "DB_POOL_MAX_IDLE cannot exceed DB_POOL_CONNECTION_LIMIT"
    );
  }

  return Object.freeze({
    connectionLimit,
    maxIdle,
    idleTimeoutMs: boundedInteger(
      env.DB_POOL_IDLE_TIMEOUT_MS,
      60_000,
      1_000,
      600_000,
      "DB_POOL_IDLE_TIMEOUT_MS"
    ),
    queueLimit: boundedInteger(
      env.DB_POOL_QUEUE_LIMIT,
      256,
      1,
      10_000,
      "DB_POOL_QUEUE_LIMIT"
    ),
    connectTimeoutMs: boundedInteger(
      env.DB_CONNECT_TIMEOUT_MS,
      10_000,
      500,
      60_000,
      "DB_CONNECT_TIMEOUT_MS"
    ),
    keepAliveInitialDelayMs: boundedInteger(
      env.DB_KEEP_ALIVE_INITIAL_DELAY_MS,
      0,
      0,
      60_000,
      "DB_KEEP_ALIVE_INITIAL_DELAY_MS"
    ),
  });
}

export function toMysqlPoolOptions(
  databaseUrl: string,
  options: DatabasePoolRuntimeOptions
) {
  if (!databaseUrl.trim()) {
    throw new Error("databaseUrl is required");
  }

  return Object.freeze({
    uri: databaseUrl,
    waitForConnections: true as const,
    connectionLimit: options.connectionLimit,
    maxIdle: options.maxIdle,
    idleTimeout: options.idleTimeoutMs,
    queueLimit: options.queueLimit,
    connectTimeout: options.connectTimeoutMs,
    enableKeepAlive: true as const,
    keepAliveInitialDelay: options.keepAliveInitialDelayMs,
  });
}

export type DatabasePoolTelemetrySnapshot = Readonly<{
  active: number;
  highWaterMark: number;
  acquired: number;
  released: number;
  enqueueCount: number;
}>;

export class DatabasePoolTelemetry {
  private active = 0;
  private highWaterMark = 0;
  private acquired = 0;
  private released = 0;
  private enqueueCount = 0;

  recordAcquire(): void {
    this.active += 1;
    this.acquired += 1;
    this.highWaterMark = Math.max(
      this.highWaterMark,
      this.active
    );
  }

  recordRelease(): void {
    if (this.active > 0) {
      this.active -= 1;
    }
    this.released += 1;
  }

  recordEnqueue(): void {
    this.enqueueCount += 1;
  }

  snapshot(): DatabasePoolTelemetrySnapshot {
    return Object.freeze({
      active: this.active,
      highWaterMark: this.highWaterMark,
      acquired: this.acquired,
      released: this.released,
      enqueueCount: this.enqueueCount,
    });
  }
}
