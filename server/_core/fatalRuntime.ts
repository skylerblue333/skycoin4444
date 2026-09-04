import { writeSync } from "node:fs";
import { sanitizeStartupError } from "./serverStartup";

export type FatalRuntimeOrigin =
  | "uncaughtException"
  | "unhandledRejection";

export type FatalRuntimeRecord = Readonly<{
  contract: "skycoin4444.runtime-fatal.v1";
  origin: FatalRuntimeOrigin;
  summary: string;
  timestamp: string;
  recoveryAttempted: false;
  defaultCrashBehaviorPreserved: true;
}>;

type FatalMonitorProcess = Pick<
  NodeJS.Process,
  "on" | "off"
>;

export function buildFatalRuntimeRecord(
  error: unknown,
  origin: FatalRuntimeOrigin,
  now: () => Date = () => new Date()
): FatalRuntimeRecord {
  return Object.freeze({
    contract: "skycoin4444.runtime-fatal.v1" as const,
    origin,
    summary: sanitizeStartupError(error),
    timestamp: now().toISOString(),
    recoveryAttempted: false as const,
    defaultCrashBehaviorPreserved: true as const,
  });
}

export function formatFatalRuntimeRecord(
  record: FatalRuntimeRecord
): string {
  return (
    "[FatalRuntime] " +
    JSON.stringify(record) +
    "\n"
  );
}

export function registerFatalRuntimeMonitoring(
  input: Readonly<{
    process?: FatalMonitorProcess;
    write?: (message: string) => void;
    now?: () => Date;
  }> = {}
): () => void {
  const monitoredProcess = input.process ?? process;
  const write =
    input.write ??
    (message => {
      writeSync(process.stderr.fd, message);
    });
  const now = input.now ?? (() => new Date());

  const handler = (
    error: Error,
    origin: FatalRuntimeOrigin
  ) => {
    try {
      write(
        formatFatalRuntimeRecord(
          buildFatalRuntimeRecord(error, origin, now)
        )
      );
    } catch {
      // Never throw from fatal monitoring. Node's original fatal
      // exception must remain the process-termination authority.
    }
  };

  monitoredProcess.on(
    "uncaughtExceptionMonitor",
    handler
  );

  return () => {
    monitoredProcess.off(
      "uncaughtExceptionMonitor",
      handler
    );
  };
}
