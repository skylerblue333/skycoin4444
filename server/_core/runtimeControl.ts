import type { RequestHandler, Express } from "express";
import type { Server } from "node:http";
import type { ReadinessAssessor } from "./readiness";

export type RuntimePhase = "starting" | "ready" | "draining" | "stopped";

export type RuntimeSnapshot = Readonly<{
  phase: RuntimePhase;
  startedAt: string;
  readyAt: string | null;
  drainStartedAt: string | null;
  stoppedAt: string | null;
  drainReason: string | null;
  uptimeMs: number;
}>;

export class RuntimeTransitionError extends Error {
  constructor(
    readonly from: RuntimePhase,
    readonly to: RuntimePhase
  ) {
    super("Invalid runtime transition: " + from + " -> " + to);
    this.name = "RuntimeTransitionError";
  }
}

export class RuntimeLifecycle {
  private phase: RuntimePhase = "starting";
  private readonly startedAtMs: number;
  private readyAtMs: number | null = null;
  private drainStartedAtMs: number | null = null;
  private stoppedAtMs: number | null = null;
  private drainReason: string | null = null;

  constructor(private readonly now: () => number = Date.now) {
    this.startedAtMs = now();
  }

  markReady(): void {
    if (this.phase !== "starting") {
      throw new RuntimeTransitionError(this.phase, "ready");
    }
    this.phase = "ready";
    this.readyAtMs = this.now();
  }

  beginDrain(reason: string): boolean {
    if (this.phase === "stopped" || this.phase === "draining") return false;
    if (this.phase !== "starting" && this.phase !== "ready") {
      throw new RuntimeTransitionError(this.phase, "draining");
    }
    this.phase = "draining";
    this.drainStartedAtMs = this.now();
    this.drainReason = reason;
    return true;
  }

  markStopped(): void {
    if (this.phase === "stopped") return;
    if (this.phase !== "draining" && this.phase !== "starting") {
      throw new RuntimeTransitionError(this.phase, "stopped");
    }
    this.phase = "stopped";
    this.stoppedAtMs = this.now();
  }

  currentPhase(): RuntimePhase {
    return this.phase;
  }

  isLive(): boolean {
    return this.phase !== "stopped";
  }

  isReady(): boolean {
    return this.phase === "ready";
  }

  snapshot(): RuntimeSnapshot {
    const now = this.now();
    const iso = (value: number | null) =>
      value === null ? null : new Date(value).toISOString();

    return Object.freeze({
      phase: this.phase,
      startedAt: new Date(this.startedAtMs).toISOString(),
      readyAt: iso(this.readyAtMs),
      drainStartedAt: iso(this.drainStartedAtMs),
      stoppedAt: iso(this.stoppedAtMs),
      drainReason: this.drainReason,
      uptimeMs: Math.max(0, now - this.startedAtMs),
    });
  }
}

export type ConcurrencySnapshot = Readonly<{
  active: number;
  maxInFlight: number;
  rejected: number;
  highWaterMark: number;
}>;

export class ConcurrencyGate {
  private active = 0;
  private rejected = 0;
  private highWaterMark = 0;

  constructor(readonly maxInFlight: number) {
    if (!Number.isInteger(maxInFlight) || maxInFlight < 1) {
      throw new RangeError("maxInFlight must be an integer greater than zero");
    }
  }

  tryAcquire(): boolean {
    if (this.active >= this.maxInFlight) {
      this.rejected += 1;
      return false;
    }
    this.active += 1;
    this.highWaterMark = Math.max(this.highWaterMark, this.active);
    return true;
  }

  release(): void {
    if (this.active <= 0) {
      throw new Error("ConcurrencyGate release called without an active lease");
    }
    this.active -= 1;
  }

  snapshot(): ConcurrencySnapshot {
    return Object.freeze({
      active: this.active,
      maxInFlight: this.maxInFlight,
      rejected: this.rejected,
      highWaterMark: this.highWaterMark,
    });
  }
}

export type HttpRuntimeOptions = Readonly<{
  requestTimeoutMs: number;
  headersTimeoutMs: number;
  keepAliveTimeoutMs: number;
  maxRequestsPerSocket: number;
  maxHeadersCount: number;
  maxConnections: number;
  maxInFlightRequests: number;
  shutdownGraceMs: number;
}>;

function boundedInteger(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number
): number {
  if (!raw?.trim()) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(
      "Runtime configuration value must be an integer between " +
        min +
        " and " +
        max
    );
  }
  return value;
}

export function runtimeOptionsFromEnv(
  env: NodeJS.ProcessEnv = process.env
): HttpRuntimeOptions {
  const requestTimeoutMs = boundedInteger(
    env.HTTP_REQUEST_TIMEOUT_MS,
    30_000,
    1_000,
    300_000
  );
  const headersTimeoutMs = boundedInteger(
    env.HTTP_HEADERS_TIMEOUT_MS,
    15_000,
    1_000,
    120_000
  );
  const keepAliveTimeoutMs = boundedInteger(
    env.HTTP_KEEP_ALIVE_TIMEOUT_MS,
    5_000,
    500,
    120_000
  );

  if (headersTimeoutMs > requestTimeoutMs) {
    throw new RangeError(
      "HTTP_HEADERS_TIMEOUT_MS cannot exceed HTTP_REQUEST_TIMEOUT_MS"
    );
  }

  return Object.freeze({
    requestTimeoutMs,
    headersTimeoutMs,
    keepAliveTimeoutMs,
    maxRequestsPerSocket: boundedInteger(
      env.HTTP_MAX_REQUESTS_PER_SOCKET,
      1_000,
      1,
      100_000
    ),
    maxHeadersCount: boundedInteger(
      env.HTTP_MAX_HEADERS_COUNT,
      128,
      16,
      2_000
    ),
    maxConnections: boundedInteger(
      env.HTTP_MAX_CONNECTIONS,
      256,
      1,
      10_000
    ),
    maxInFlightRequests: boundedInteger(
      env.MAX_IN_FLIGHT_REQUESTS,
      128,
      1,
      10_000
    ),
    shutdownGraceMs: boundedInteger(
      env.SHUTDOWN_GRACE_MS,
      10_000,
      1_000,
      120_000
    ),
  });
}

export function configureHttpServer(
  server: Server,
  options: HttpRuntimeOptions
): void {
  server.requestTimeout = options.requestTimeoutMs;
  server.headersTimeout = options.headersTimeoutMs;
  server.keepAliveTimeout = options.keepAliveTimeoutMs;
  server.maxRequestsPerSocket = options.maxRequestsPerSocket;
  server.maxHeadersCount = options.maxHeadersCount;
  server.maxConnections = options.maxConnections;
}

export function registerRuntimeRoutes(
  app: Express,
  lifecycle: RuntimeLifecycle,
  concurrency: ConcurrencyGate,
  readiness?: ReadinessAssessor,
  options?: HttpRuntimeOptions
): void {
  app.get("/api/runtime/live", (_req, res) => {
    const snapshot = lifecycle.snapshot();
    res.set("Cache-Control", "no-store");
    res.status(lifecycle.isLive() ? 200 : 503).json({
      status: lifecycle.isLive() ? "live" : "stopped",
      runtime: snapshot,
    });
  });

  app.get("/api/runtime/ready", async (_req, res) => {
    const snapshot = lifecycle.snapshot();
    const runtimeReady = lifecycle.isReady();
    let dependencyReadiness = null;
    let dependencyProbeFailed = false;

    if (runtimeReady && readiness) {
      try {
        dependencyReadiness = await readiness.assess();
      } catch {
        dependencyProbeFailed = true;
      }
    }

    const dependenciesReady =
      !readiness ||
      (!dependencyProbeFailed &&
        dependencyReadiness?.status === "ready");
    const ready = runtimeReady && dependenciesReady;

    res.set("Cache-Control", "no-store");
    res.status(ready ? 200 : 503).json({
      status: ready ? "ready" : "not_ready",
      runtime: snapshot,
      concurrency: concurrency.snapshot(),
      dependencies: dependencyProbeFailed
        ? {
            contract: "skycoin4444.dependency-readiness.v1",
            status: "not_ready",
            probe: "unavailable",
            productionCertification: false,
          }
        : dependencyReadiness,
    });
  });

  app.get("/api/runtime/state", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      contract: "skycoin4444.runtime-control.v1",
      productionCertification: false,
      runtime: lifecycle.snapshot(),
      concurrency: concurrency.snapshot(),
      httpLimits: options
        ? {
            requestTimeoutMs: options.requestTimeoutMs,
            headersTimeoutMs: options.headersTimeoutMs,
            keepAliveTimeoutMs: options.keepAliveTimeoutMs,
            maxRequestsPerSocket: options.maxRequestsPerSocket,
            maxHeadersCount: options.maxHeadersCount,
            maxConnections: options.maxConnections,
            maxInFlightRequests: options.maxInFlightRequests,
          }
        : null,
    });
  });
}

export function createDrainGuard(
  lifecycle: RuntimeLifecycle
): RequestHandler {
  return (_req, res, next) => {
    const phase = lifecycle.currentPhase();
    if (phase !== "draining" && phase !== "stopped") {
      next();
      return;
    }

    res.set("Retry-After", "1");
    res.set("Connection", "close");
    res.status(503).json({
      error: "runtime_draining",
      phase,
      retryable: phase === "draining",
    });
  };
}

export function createConcurrencyMiddleware(
  gate: ConcurrencyGate
): RequestHandler {
  return (_req, res, next) => {
    if (!gate.tryAcquire()) {
      res.set("Retry-After", "1");
      res.status(503).json({
        error: "runtime_overloaded",
        maxInFlight: gate.maxInFlight,
      });
      return;
    }

    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      gate.release();
    };

    res.once("finish", release);
    res.once("close", release);
    next();
  };
}

type ShutdownServer = Pick<Server, "close"> &
  Partial<Pick<Server, "closeIdleConnections" | "closeAllConnections">>;

export type ShutdownController = Readonly<{
  shutdown: (reason: string) => Promise<void>;
}>;

export function createShutdownController(
  server: ShutdownServer,
  lifecycle: RuntimeLifecycle,
  graceMs: number
): ShutdownController {
  if (!Number.isInteger(graceMs) || graceMs < 1) {
    throw new RangeError("graceMs must be an integer greater than zero");
  }

  let inFlight: Promise<void> | null = null;

  const shutdown = (reason: string): Promise<void> => {
    if (inFlight) return inFlight;
    lifecycle.beginDrain(reason);
    server.closeIdleConnections?.();

    inFlight = new Promise<void>((resolve, reject) => {
      let settled = false;
      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(forceTimer);
        lifecycle.markStopped();
        if (error) reject(error);
        else resolve();
      };

      const forceTimer = setTimeout(() => {
        server.closeAllConnections?.();
        finish(
          new Error(
            "Graceful shutdown exceeded " + graceMs + "ms and forced close"
          )
        );
      }, graceMs);
      forceTimer.unref();

      try {
        server.close(error => finish(error));
      } catch (error) {
        finish(error instanceof Error ? error : new Error(String(error)));
      }
    });

    return inFlight;
  };

  return Object.freeze({ shutdown });
}
