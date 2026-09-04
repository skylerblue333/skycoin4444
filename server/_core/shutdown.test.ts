import { describe, expect, it, vi } from "vitest";
import { RuntimeLifecycle } from "./runtimeControl";
import {
  ApplicationShutdownCoordinator,
  applicationShutdownOptionsFromEnv,
} from "./shutdown";

describe("coordinated application shutdown", () => {
  it("drains before background work, then HTTP, then final resources", async () => {
    const order: string[] = [];
    let now = Date.parse("2026-09-04T00:00:00.000Z");
    const lifecycle = new RuntimeLifecycle(() => now);
    lifecycle.markReady();

    const coordinator = new ApplicationShutdownCoordinator({
      lifecycle,
      http: {
        async shutdown() {
          order.push("http");
          lifecycle.markStopped();
        },
      },
      backgroundHooks: [
        {
          name: "dispatcher",
          async run() {
            expect(lifecycle.currentPhase()).toBe("draining");
            order.push("dispatcher");
          },
        },
      ],
      finalHooks: [
        {
          name: "database",
          async run() {
            expect(lifecycle.currentPhase()).toBe("stopped");
            order.push("database");
          },
        },
      ],
      options: { resourceTimeoutMs: 100 },
      now: () => new Date(now++),
    });

    await coordinator.shutdown("deploy");

    expect(order).toEqual(["dispatcher", "http", "database"]);
    expect(coordinator.snapshot()).toMatchObject({
      phase: "stopped",
      reason: "deploy",
      errorCount: 0,
      backgroundHookCount: 1,
      finalHookCount: 1,
      productionAvailabilityClaim: false,
    });
  });

  it("is idempotent across repeated shutdown calls", async () => {
    const lifecycle = new RuntimeLifecycle(() => 1_000);
    lifecycle.markReady();

    let resolveHttp: (() => void) | undefined;
    const httpPromise = new Promise<void>(resolve => {
      resolveHttp = resolve;
    });
    const http = vi.fn(async () => {
      await httpPromise;
      lifecycle.markStopped();
    });

    const coordinator = new ApplicationShutdownCoordinator({
      lifecycle,
      http: { shutdown: http },
      options: { resourceTimeoutMs: 100 },
    });

    const first = coordinator.shutdown("SIGTERM");
    const second = coordinator.shutdown("SIGINT");

    expect(first).toBe(second);
    expect(coordinator.snapshot().reason).toBe("SIGTERM");
    resolveHttp?.();
    await first;
    expect(http).toHaveBeenCalledTimes(1);
  });

  it("continues cleanup after a bounded background-hook failure", async () => {
    const lifecycle = new RuntimeLifecycle(() => 1_000);
    lifecycle.markReady();
    let finalRan = false;

    const coordinator = new ApplicationShutdownCoordinator({
      lifecycle,
      http: {
        async shutdown() {
          lifecycle.markStopped();
        },
      },
      backgroundHooks: [
        {
          name: "broken-worker",
          async run() {
            throw new Error("worker failed");
          },
        },
      ],
      finalHooks: [
        {
          name: "database",
          async run() {
            finalRan = true;
          },
        },
      ],
      options: { resourceTimeoutMs: 100 },
    });

    await expect(coordinator.shutdown("test")).rejects.toThrow(
      "Application shutdown completed with resource failures"
    );
    expect(finalRan).toBe(true);
    expect(coordinator.snapshot()).toMatchObject({
      phase: "failed",
      errorCount: 1,
    });
  });

  it("times out a hung resource and still drains HTTP", async () => {
    const lifecycle = new RuntimeLifecycle(() => 1_000);
    lifecycle.markReady();
    let httpRan = false;

    const coordinator = new ApplicationShutdownCoordinator({
      lifecycle,
      http: {
        async shutdown() {
          httpRan = true;
          lifecycle.markStopped();
        },
      },
      backgroundHooks: [
        {
          name: "hung-worker",
          run: () => new Promise(() => undefined),
        },
      ],
      options: { resourceTimeoutMs: 10 },
    });

    await expect(coordinator.shutdown("test")).rejects.toThrow(
      "Application shutdown completed with resource failures"
    );
    expect(httpRan).toBe(true);
    expect(coordinator.snapshot().errorCount).toBe(1);
  });

  it("validates bounded per-resource timeout configuration", () => {
    expect(
      applicationShutdownOptionsFromEnv({
        SHUTDOWN_RESOURCE_TIMEOUT_MS: "9000",
      } as NodeJS.ProcessEnv)
    ).toEqual({ resourceTimeoutMs: 9_000 });

    expect(() =>
      applicationShutdownOptionsFromEnv({
        SHUTDOWN_RESOURCE_TIMEOUT_MS: "20",
      } as NodeJS.ProcessEnv)
    ).toThrow(/SHUTDOWN_RESOURCE_TIMEOUT_MS/);
  });
});
