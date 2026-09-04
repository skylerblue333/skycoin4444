import { describe, expect, it } from "vitest";
import {
  DependencyReadinessCoordinator,
  readinessOptionsFromEnv,
  type ReadinessOptions,
} from "./readiness";

const options: ReadinessOptions = {
  databaseTimeoutMs: 50,
  cacheMs: 500,
};

describe("dependency readiness coordinator", () => {
  it("reports ready only after required configuration and database checks pass", async () => {
    const coordinator = new DependencyReadinessCoordinator({
      databaseProbe: async () => ({ ok: true }),
      configProbe: () => [],
      options,
      now: () => Date.parse("2026-09-04T00:00:00.000Z"),
    });

    await expect(coordinator.assess()).resolves.toMatchObject({
      status: "ready",
      degraded: false,
      configuration: { status: "ok", issueKeys: [] },
      database: { status: "ok" },
      eventDispatcher: { status: "disabled", required: false },
      productionCertification: false,
    });
  });

  it("fails closed on invalid configuration and skips the database", async () => {
    let databaseCalls = 0;
    const coordinator = new DependencyReadinessCoordinator({
      databaseProbe: async () => {
        databaseCalls += 1;
      },
      configProbe: () => [
        { key: "JWT_SECRET", message: "too short" },
      ],
      options,
    });

    const snapshot = await coordinator.assess();

    expect(databaseCalls).toBe(0);
    expect(snapshot).toMatchObject({
      status: "not_ready",
      configuration: {
        status: "invalid",
        issueKeys: ["JWT_SECRET"],
      },
      database: { status: "skipped" },
    });
  });

  it("fails closed when the database is unavailable", async () => {
    const coordinator = new DependencyReadinessCoordinator({
      databaseProbe: async () => {
        throw new Error("database unavailable");
      },
      configProbe: () => [],
      options,
    });

    await expect(coordinator.assess()).resolves.toMatchObject({
      status: "not_ready",
      database: { status: "unavailable" },
    });
  });

  it("bounds a hung database probe with a timeout", async () => {
    const coordinator = new DependencyReadinessCoordinator({
      databaseProbe: () => new Promise(() => undefined),
      configProbe: () => [],
      options: {
        databaseTimeoutMs: 10,
        cacheMs: 0,
      },
    });

    await expect(coordinator.assess()).resolves.toMatchObject({
      status: "not_ready",
      database: { status: "timeout" },
    });
  });

  it("caches successful dependency checks for the configured window", async () => {
    let now = 1_000;
    let calls = 0;
    const coordinator = new DependencyReadinessCoordinator({
      databaseProbe: async () => {
        calls += 1;
      },
      configProbe: () => [],
      options,
      now: () => now,
    });

    await coordinator.assess();
    await coordinator.assess();
    expect(calls).toBe(1);

    now += 501;
    await coordinator.assess();
    expect(calls).toBe(2);
  });

  it("deduplicates concurrent readiness probes", async () => {
    let calls = 0;
    let resolveDatabase: (() => void) | undefined;
    const database = new Promise<void>(resolve => {
      resolveDatabase = resolve;
    });

    const coordinator = new DependencyReadinessCoordinator({
      databaseProbe: () => {
        calls += 1;
        return database;
      },
      configProbe: () => [],
      options,
    });

    const first = coordinator.assess();
    const second = coordinator.assess();

    expect(calls).toBe(1);
    resolveDatabase?.();

    const [left, right] = await Promise.all([first, second]);
    expect(left).toBe(right);
  });

  it("reports dispatcher degradation without failing required readiness", async () => {
    const coordinator = new DependencyReadinessCoordinator({
      databaseProbe: async () => undefined,
      configProbe: () => [],
      dispatcherProbe: () => ({
        enabled: true,
        running: false,
        lastCycleAt: null,
        lastFailureAt: null,
      }),
      options,
    });

    await expect(coordinator.assess()).resolves.toMatchObject({
      status: "ready",
      degraded: true,
      eventDispatcher: {
        status: "degraded",
        required: false,
      },
    });
  });

  it("validates bounded readiness environment settings", () => {
    expect(
      readinessOptionsFromEnv({
        READINESS_DATABASE_TIMEOUT_MS: "2000",
        READINESS_CACHE_MS: "750",
      } as NodeJS.ProcessEnv)
    ).toEqual({
      databaseTimeoutMs: 2_000,
      cacheMs: 750,
    });

    expect(() =>
      readinessOptionsFromEnv({
        READINESS_DATABASE_TIMEOUT_MS: "0",
      } as NodeJS.ProcessEnv)
    ).toThrow(/READINESS_DATABASE_TIMEOUT_MS/);
  });
});
