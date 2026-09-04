import { describe, expect, it, vi } from "vitest";
import {
  ConcurrencyGate,
  RuntimeLifecycle,
  RuntimeTransitionError,
  configureHttpServer,
  createShutdownController,
  registerRuntimeRoutes,
  runtimeOptionsFromEnv,
} from "./runtimeControl";

describe("runtime lifecycle", () => {
  it("moves through ready, draining, and stopped states deterministically", () => {
    let now = Date.parse("2026-09-04T00:00:00.000Z");
    const lifecycle = new RuntimeLifecycle(() => now);

    expect(lifecycle.snapshot().phase).toBe("starting");

    now += 10;
    lifecycle.markReady();
    expect(lifecycle.isReady()).toBe(true);

    now += 20;
    expect(lifecycle.beginDrain("deploy")).toBe(true);
    expect(lifecycle.beginDrain("duplicate")).toBe(false);
    expect(lifecycle.isReady()).toBe(false);

    now += 30;
    lifecycle.markStopped();
    const snapshot = lifecycle.snapshot();
    expect(snapshot.phase).toBe("stopped");
    expect(snapshot.drainReason).toBe("deploy");
    expect(snapshot.uptimeMs).toBe(60);
  });

  it("rejects an invalid transition back to ready", () => {
    const lifecycle = new RuntimeLifecycle(() => 1_000);
    lifecycle.markReady();
    lifecycle.beginDrain("test");
    expect(() => lifecycle.markReady()).toThrow(RuntimeTransitionError);
  });
});

describe("runtime overload gate", () => {
  it("tracks active, rejected, and high-water requests", () => {
    const gate = new ConcurrencyGate(2);
    expect(gate.tryAcquire()).toBe(true);
    expect(gate.tryAcquire()).toBe(true);
    expect(gate.tryAcquire()).toBe(false);
    expect(gate.snapshot()).toEqual({
      active: 2,
      maxInFlight: 2,
      rejected: 1,
      highWaterMark: 2,
    });

    gate.release();
    expect(gate.tryAcquire()).toBe(true);
    gate.release();
    gate.release();
    expect(gate.snapshot().active).toBe(0);
  });

  it("refuses an unmatched release", () => {
    const gate = new ConcurrencyGate(1);
    expect(() => gate.release()).toThrow(
      "ConcurrencyGate release called without an active lease"
    );
  });
});

describe("runtime configuration", () => {
  it("applies bounded HTTP server options", () => {
    const options = runtimeOptionsFromEnv({
      HTTP_REQUEST_TIMEOUT_MS: "40000",
      HTTP_HEADERS_TIMEOUT_MS: "12000",
      HTTP_KEEP_ALIVE_TIMEOUT_MS: "6000",
      HTTP_MAX_REQUESTS_PER_SOCKET: "500",
      MAX_IN_FLIGHT_REQUESTS: "64",
      SHUTDOWN_GRACE_MS: "9000",
    } as NodeJS.ProcessEnv);

    const server = {
      requestTimeout: 0,
      headersTimeout: 0,
      keepAliveTimeout: 0,
      maxRequestsPerSocket: 0,
    };

    configureHttpServer(server as never, options);

    expect(server).toEqual({
      requestTimeout: 40000,
      headersTimeout: 12000,
      keepAliveTimeout: 6000,
      maxRequestsPerSocket: 500,
    });
    expect(options.maxInFlightRequests).toBe(64);
    expect(options.shutdownGraceMs).toBe(9000);
  });

  it("fails fast on incoherent timeout settings", () => {
    expect(() =>
      runtimeOptionsFromEnv({
        HTTP_REQUEST_TIMEOUT_MS: "5000",
        HTTP_HEADERS_TIMEOUT_MS: "6000",
      } as NodeJS.ProcessEnv)
    ).toThrow(
      "HTTP_HEADERS_TIMEOUT_MS cannot exceed HTTP_REQUEST_TIMEOUT_MS"
    );
  });
});

describe("graceful shutdown", () => {
  it("drains once and resolves after the server closes", async () => {
    const lifecycle = new RuntimeLifecycle(() => 1_000);
    lifecycle.markReady();

    let closeCallback: ((error?: Error) => void) | undefined;
    const server = {
      close: vi.fn((callback?: (error?: Error) => void) => {
        closeCallback = callback;
        return server;
      }),
      closeIdleConnections: vi.fn(),
      closeAllConnections: vi.fn(),
    };

    const controller = createShutdownController(
      server as never,
      lifecycle,
      10_000
    );
    const first = controller.shutdown("deploy");
    const second = controller.shutdown("ignored");

    expect(first).toBe(second);
    expect(lifecycle.currentPhase()).toBe("draining");
    expect(server.close).toHaveBeenCalledTimes(1);
    expect(server.closeIdleConnections).toHaveBeenCalledTimes(1);

    closeCallback?.();
    await expect(first).resolves.toBeUndefined();

    expect(lifecycle.currentPhase()).toBe("stopped");
    expect(server.closeAllConnections).not.toHaveBeenCalled();
  });
});


describe("runtime dependency readiness route", () => {
  it("fails runtime readiness when required dependencies are not ready", async () => {
    const routes: Record<
      string,
      (req: unknown, res: Record<string, unknown>) => void | Promise<void>
    > = {};
    const app = {
      get(
        path: string,
        handler: (
          req: unknown,
          res: Record<string, unknown>
        ) => void | Promise<void>
      ) {
        routes[path] = handler;
      },
    };

    const lifecycle = new RuntimeLifecycle(() => 1_000);
    lifecycle.markReady();
    const gate = new ConcurrencyGate(4);

    registerRuntimeRoutes(
      app as never,
      lifecycle,
      gate,
      {
        async assess() {
          return {
            contract: "skycoin4444.dependency-readiness.v1",
            status: "not_ready",
            degraded: false,
            checkedAt: "2026-09-04T00:00:00.000Z",
            configuration: {
              status: "ok",
              issueKeys: [],
            },
            database: { status: "unavailable" },
            eventDispatcher: {
              status: "disabled",
              required: false,
            },
            productionCertification: false,
          };
        },
      }
    );

    const body: {
      statusCode?: number;
      payload?: unknown;
      headers: Record<string, string>;
    } = { headers: {} };
    const response: Record<string, unknown> = {
      set(name: string, value: string) {
        body.headers[name] = value;
        return response;
      },
      status(code: number) {
        body.statusCode = code;
        return response;
      },
      json(payload: unknown) {
        body.payload = payload;
        return response;
      },
    };

    await routes["/api/runtime/ready"]?.({}, response);

    expect(body.statusCode).toBe(503);
    expect(body.payload).toMatchObject({
      status: "not_ready",
      dependencies: {
        status: "not_ready",
        database: { status: "unavailable" },
      },
    });
  });
});
