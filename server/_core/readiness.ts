import { db } from "../db";
import { inspectProductionBetaConfig } from "./productionConfig";
import type { OutboxDispatcherSnapshot } from "./outboxDispatcher";

export type ReadinessOptions = Readonly<{
  databaseTimeoutMs: number;
  cacheMs: number;
}>;

export type ConfigurationReadiness = Readonly<{
  status: "ok" | "invalid" | "unavailable";
  issueKeys: readonly string[];
}>;

export type DatabaseReadiness = Readonly<{
  status: "ok" | "unavailable" | "timeout" | "skipped";
}>;

export type DispatcherReadinessReason =
  | "not_configured"
  | "disabled"
  | "probe_failed"
  | "not_running"
  | "success_not_observed"
  | "invalid_success_timestamp"
  | "invalid_failure_timestamp"
  | "failure_not_recovered"
  | "healthy";

export type DispatcherReadiness = Readonly<{
  status: "disabled" | "ok" | "degraded";
  reason: DispatcherReadinessReason;
  required: false;
}>;

export type DependencyReadinessSnapshot = Readonly<{
  contract: "skycoin4444.dependency-readiness.v1";
  status: "ready" | "not_ready";
  degraded: boolean;
  checkedAt: string;
  configuration: ConfigurationReadiness;
  database: DatabaseReadiness;
  eventDispatcher: DispatcherReadiness;
  productionCertification: false;
}>;

export interface ReadinessAssessor {
  assess(): Promise<DependencyReadinessSnapshot>;
}

type DatabaseProbe = () => Promise<unknown>;
type ConfigProbe = () => ReturnType<typeof inspectProductionBetaConfig>;
type DispatcherProbe = () => Pick<
  OutboxDispatcherSnapshot,
  "enabled" | "running" | "lastCycleAt" | "lastFailureAt"
>;

class ReadinessTimeoutError extends Error {
  constructor(readonly timeoutMs: number) {
    super("Readiness dependency probe timed out");
    this.name = "ReadinessTimeoutError";
  }
}

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

export function readinessOptionsFromEnv(
  env: NodeJS.ProcessEnv = process.env
): ReadinessOptions {
  return Object.freeze({
    databaseTimeoutMs: boundedInteger(
      env.READINESS_DATABASE_TIMEOUT_MS,
      1_500,
      50,
      10_000,
      "READINESS_DATABASE_TIMEOUT_MS"
    ),
    cacheMs: boundedInteger(
      env.READINESS_CACHE_MS,
      500,
      0,
      5_000,
      "READINESS_CACHE_MS"
    ),
  });
}

async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number
): Promise<T> {
  let timer: NodeJS.Timeout | null = null;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new ReadinessTimeoutError(timeoutMs)),
      timeoutMs
    );
    timer.unref();
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function dispatcherReadiness(
  probe: DispatcherProbe | undefined
): DispatcherReadiness {
  const result = (
    status: DispatcherReadiness["status"],
    reason: DispatcherReadinessReason
  ): DispatcherReadiness =>
    Object.freeze({ status, reason, required: false as const });

  if (!probe) {
    return result("disabled", "not_configured");
  }

  try {
    const snapshot = probe();
    if (!snapshot.enabled) {
      return result("disabled", "disabled");
    }

    if (!snapshot.running) {
      return result("degraded", "not_running");
    }

    const parseTimestamp = (value: string | null | undefined) => {
      if (value === null || value === undefined) return null;
      const parsed = Date.parse(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    if (snapshot.lastCycleAt === null || snapshot.lastCycleAt === undefined) {
      return result("degraded", "success_not_observed");
    }

    const latestSuccess = parseTimestamp(snapshot.lastCycleAt);
    if (latestSuccess === null) {
      return result("degraded", "invalid_success_timestamp");
    }

    if (snapshot.lastFailureAt === null) {
      return result("ok", "healthy");
    }

    const latestFailure = parseTimestamp(snapshot.lastFailureAt);
    if (latestFailure === null) {
      return result("degraded", "invalid_failure_timestamp");
    }

    if (latestFailure >= latestSuccess) {
      return result("degraded", "failure_not_recovered");
    }

    return result("ok", "healthy");
  } catch {
    return result("degraded", "probe_failed");
  }
}

export class DependencyReadinessCoordinator
  implements ReadinessAssessor
{
  private cached:
    | Readonly<{
        expiresAtMs: number;
        snapshot: DependencyReadinessSnapshot;
      }>
    | null = null;
  private inFlight: Promise<DependencyReadinessSnapshot> | null = null;

  constructor(
    private readonly input: Readonly<{
      databaseProbe: DatabaseProbe;
      configProbe: ConfigProbe;
      dispatcherProbe?: DispatcherProbe;
      options: ReadinessOptions;
      now?: () => number;
    }>
  ) {}

  invalidate(): void {
    this.cached = null;
  }

  async assess(): Promise<DependencyReadinessSnapshot> {
    const now = this.now();

    if (
      this.cached &&
      this.input.options.cacheMs > 0 &&
      now < this.cached.expiresAtMs
    ) {
      return this.cached.snapshot;
    }

    if (this.inFlight) return this.inFlight;

    const evaluation = this.evaluate(now);
    this.inFlight = evaluation;

    try {
      const snapshot = await evaluation;
      if (this.input.options.cacheMs > 0) {
        this.cached = Object.freeze({
          snapshot,
          expiresAtMs: this.now() + this.input.options.cacheMs,
        });
      }
      return snapshot;
    } finally {
      this.inFlight = null;
    }
  }

  private now(): number {
    return (this.input.now ?? Date.now)();
  }

  private async evaluate(
    checkedAtMs: number
  ): Promise<DependencyReadinessSnapshot> {
    let configuration: ConfigurationReadiness;

    try {
      const issues = this.input.configProbe();
      configuration = Object.freeze({
        status: issues.length === 0 ? ("ok" as const) : ("invalid" as const),
        issueKeys: Object.freeze(issues.map(issue => issue.key)),
      });
    } catch {
      configuration = Object.freeze({
        status: "unavailable" as const,
        issueKeys: Object.freeze(["CONFIGURATION_PROBE_FAILED"]),
      });
    }

    let database: DatabaseReadiness;

    if (configuration.status !== "ok") {
      database = Object.freeze({ status: "skipped" as const });
    } else {
      try {
        await withTimeout(
          this.input.databaseProbe(),
          this.input.options.databaseTimeoutMs
        );
        database = Object.freeze({ status: "ok" as const });
      } catch (error) {
        database = Object.freeze({
          status:
            error instanceof ReadinessTimeoutError
              ? ("timeout" as const)
              : ("unavailable" as const),
        });
      }
    }

    const eventDispatcher = dispatcherReadiness(
      this.input.dispatcherProbe
    );
    const ready =
      configuration.status === "ok" &&
      database.status === "ok";

    return Object.freeze({
      contract: "skycoin4444.dependency-readiness.v1" as const,
      status: ready ? ("ready" as const) : ("not_ready" as const),
      degraded: eventDispatcher.status === "degraded",
      checkedAt: new Date(checkedAtMs).toISOString(),
      configuration,
      database,
      eventDispatcher,
      productionCertification: false as const,
    });
  }
}

export function createDependencyReadinessCoordinator(
  input: Readonly<{
    env?: NodeJS.ProcessEnv;
    databaseProbe?: DatabaseProbe;
    configProbe?: ConfigProbe;
    dispatcher?: { snapshot(): OutboxDispatcherSnapshot };
    now?: () => number;
  }> = {}
): DependencyReadinessCoordinator {
  const env = input.env ?? process.env;

  return new DependencyReadinessCoordinator({
    databaseProbe:
      input.databaseProbe ??
      (() =>
        db.query.users.findFirst({
          columns: { id: true },
        })),
    configProbe:
      input.configProbe ??
      (() =>
        env.NODE_ENV === "production"
          ? inspectProductionBetaConfig(env)
          : []),
    dispatcherProbe: input.dispatcher
      ? () => input.dispatcher!.snapshot()
      : undefined,
    options: readinessOptionsFromEnv(env),
    now: input.now,
  });
}
