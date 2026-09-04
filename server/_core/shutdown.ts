import type { Express } from "express";
import type {
  RuntimeLifecycle,
  ShutdownController,
} from "./runtimeControl";

export type ShutdownPhase =
  | "idle"
  | "draining"
  | "stopping_background"
  | "draining_http"
  | "closing_resources"
  | "stopped"
  | "failed";

export type ShutdownHook = Readonly<{
  name: string;
  run: () => Promise<void> | void;
}>;

export type ApplicationShutdownOptions = Readonly<{
  resourceTimeoutMs: number;
}>;

export type ApplicationShutdownSnapshot = Readonly<{
  phase: ShutdownPhase;
  reason: string | null;
  startedAt: string | null;
  completedAt: string | null;
  errorCount: number;
  backgroundHookCount: number;
  finalHookCount: number;
  productionAvailabilityClaim: false;
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

export function applicationShutdownOptionsFromEnv(
  env: NodeJS.ProcessEnv = process.env
): ApplicationShutdownOptions {
  return Object.freeze({
    resourceTimeoutMs: boundedInteger(
      env.SHUTDOWN_RESOURCE_TIMEOUT_MS,
      5_000,
      100,
      60_000,
      "SHUTDOWN_RESOURCE_TIMEOUT_MS"
    ),
  });
}

class ShutdownHookTimeoutError extends Error {
  constructor(
    readonly hookName: string,
    readonly timeoutMs: number
  ) {
    super("Shutdown hook timed out: " + hookName);
    this.name = "ShutdownHookTimeoutError";
  }
}

async function runHookWithTimeout(
  hook: ShutdownHook,
  timeoutMs: number
): Promise<void> {
  let timer: NodeJS.Timeout | null = null;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new ShutdownHookTimeoutError(hook.name, timeoutMs)),
      timeoutMs
    );
  });

  try {
    await Promise.race([
      Promise.resolve().then(() => hook.run()),
      timeout,
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export class ApplicationShutdownCoordinator {
  private phase: ShutdownPhase = "idle";
  private reason: string | null = null;
  private startedAt: Date | null = null;
  private completedAt: Date | null = null;
  private errorCount = 0;
  private inFlight: Promise<void> | null = null;

  constructor(
    private readonly input: Readonly<{
      lifecycle: RuntimeLifecycle;
      http: ShutdownController;
      backgroundHooks?: readonly ShutdownHook[];
      finalHooks?: readonly ShutdownHook[];
      options: ApplicationShutdownOptions;
      now?: () => Date;
    }>
  ) {}

  shutdown(reason: string): Promise<void> {
    if (this.inFlight) return this.inFlight;

    this.inFlight = this.execute(reason);
    return this.inFlight;
  }

  snapshot(): ApplicationShutdownSnapshot {
    return Object.freeze({
      phase: this.phase,
      reason: this.reason,
      startedAt: this.startedAt?.toISOString() ?? null,
      completedAt: this.completedAt?.toISOString() ?? null,
      errorCount: this.errorCount,
      backgroundHookCount: this.input.backgroundHooks?.length ?? 0,
      finalHookCount: this.input.finalHooks?.length ?? 0,
      productionAvailabilityClaim: false as const,
    });
  }

  private now(): Date {
    return (this.input.now ?? (() => new Date()))();
  }

  private async execute(reason: string): Promise<void> {
    const errors: Error[] = [];
    this.reason = reason;
    this.startedAt = this.now();
    this.phase = "draining";
    this.input.lifecycle.beginDrain(reason);

    this.phase = "stopping_background";
    await this.runHooks(
      this.input.backgroundHooks ?? [],
      errors
    );

    this.phase = "draining_http";
    try {
      await this.input.http.shutdown(reason);
    } catch (error) {
      errors.push(
        error instanceof Error ? error : new Error(String(error))
      );
    }

    this.phase = "closing_resources";
    await this.runHooks(this.input.finalHooks ?? [], errors);

    this.completedAt = this.now();
    this.errorCount = errors.length;
    this.phase = errors.length === 0 ? "stopped" : "failed";

    if (errors.length > 0) {
      throw new AggregateError(
        errors,
        "Application shutdown completed with resource failures"
      );
    }
  }

  private async runHooks(
    hooks: readonly ShutdownHook[],
    errors: Error[]
  ): Promise<void> {
    for (const hook of hooks) {
      try {
        await runHookWithTimeout(
          hook,
          this.input.options.resourceTimeoutMs
        );
      } catch (error) {
        errors.push(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }
  }
}

export function registerApplicationShutdownSignals(
  coordinator: ApplicationShutdownCoordinator
): () => void {
  const handle = (signal: "SIGTERM" | "SIGINT") => {
    void coordinator.shutdown(signal).catch(error => {
      console.error(
        "[Shutdown] coordinated shutdown completed with failures",
        error instanceof Error ? error.message : String(error)
      );
      process.exitCode = 1;
    });
  };

  const onTerm = () => handle("SIGTERM");
  const onInt = () => handle("SIGINT");

  process.once("SIGTERM", onTerm);
  process.once("SIGINT", onInt);

  return () => {
    process.off("SIGTERM", onTerm);
    process.off("SIGINT", onInt);
  };
}

export function registerShutdownDiagnostics(
  app: Express,
  coordinator: ApplicationShutdownCoordinator
): void {
  app.get("/api/runtime/shutdown", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
      contract: "skycoin4444.application-shutdown.v1",
      ...coordinator.snapshot(),
    });
  });
}
