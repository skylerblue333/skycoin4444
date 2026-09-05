import { describe, expect, it } from "vitest";
import mysql from "mysql2/promise";
import {
  DatabasePoolTelemetry,
  databasePoolOptionsFromEnv,
  toMysqlPoolOptions,
} from "./databasePool";

describe("database pool configuration", () => {
  it("applies bounded explicit defaults", () => {
    expect(
      databasePoolOptionsFromEnv({} as NodeJS.ProcessEnv)
    ).toEqual({
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeoutMs: 60_000,
      queueLimit: 256,
      connectTimeoutMs: 10_000,
      keepAliveInitialDelayMs: 0,
    });
  });

  it("accepts bounded overrides and preserves URI configuration", () => {
    const runtime = databasePoolOptionsFromEnv({
      DB_POOL_CONNECTION_LIMIT: "24",
      DB_POOL_MAX_IDLE: "12",
      DB_POOL_IDLE_TIMEOUT_MS: "45000",
      DB_POOL_QUEUE_LIMIT: "128",
      DB_CONNECT_TIMEOUT_MS: "7500",
      DB_KEEP_ALIVE_INITIAL_DELAY_MS: "1000",
    } as NodeJS.ProcessEnv);

    expect(
      toMysqlPoolOptions(
        "mysql://user:pass@db.example:3306/sky?charset=utf8mb4",
        runtime
      )
    ).toEqual({
      uri: "mysql://user:pass@db.example:3306/sky?charset=utf8mb4",
      waitForConnections: true,
      connectionLimit: 24,
      maxIdle: 12,
      idleTimeout: 45_000,
      queueLimit: 128,
      connectTimeout: 7_500,
      enableKeepAlive: true,
      keepAliveInitialDelay: 1_000,
    });
  });

  it("returns mysql2-compatible mutable URI options", async () => {
    const runtime = databasePoolOptionsFromEnv({} as NodeJS.ProcessEnv);
    const options = toMysqlPoolOptions(
      "mysql://user:pass@db.example:3306/sky",
      runtime
    );

    expect(Object.isExtensible(options)).toBe(true);

    // mysql2 expands URI fields onto this object synchronously. Constructing
    // the pool is therefore the regression check for the hosted startup crash.
    const pool = mysql.createPool(options);
    await pool.end();
  });

  it("rejects unbounded or incoherent pool settings", () => {
    expect(() =>
      databasePoolOptionsFromEnv({
        DB_POOL_QUEUE_LIMIT: "0",
      } as NodeJS.ProcessEnv)
    ).toThrow(/DB_POOL_QUEUE_LIMIT/);

    expect(() =>
      databasePoolOptionsFromEnv({
        DB_POOL_CONNECTION_LIMIT: "5",
        DB_POOL_MAX_IDLE: "6",
      } as NodeJS.ProcessEnv)
    ).toThrow(/cannot exceed/);
  });
});

describe("database pool telemetry", () => {
  it("tracks active connections, pressure, and high-water mark", () => {
    const telemetry = new DatabasePoolTelemetry();

    telemetry.recordAcquire();
    telemetry.recordAcquire();
    telemetry.recordEnqueue();
    telemetry.recordRelease();

    expect(telemetry.snapshot()).toEqual({
      active: 1,
      highWaterMark: 2,
      acquired: 2,
      released: 1,
      enqueueCount: 1,
    });
  });

  it("never reports a negative active count", () => {
    const telemetry = new DatabasePoolTelemetry();

    telemetry.recordRelease();
    telemetry.recordRelease();

    expect(telemetry.snapshot()).toMatchObject({
      active: 0,
      released: 2,
    });
  });
});
