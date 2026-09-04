import net from "node:net";
import type { Server } from "node:http";

export type ServerStartupOptions = Readonly<{
  preferredPort: number;
  allowPortFallback: boolean;
  fallbackSpan: number;
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

export function serverStartupOptionsFromEnv(
  env: NodeJS.ProcessEnv = process.env
): ServerStartupOptions {
  const preferredPort = boundedInteger(
    env.PORT,
    3_000,
    1,
    65_535,
    "PORT"
  );
  const fallbackSpan = boundedInteger(
    env.DEV_PORT_FALLBACK_SPAN,
    20,
    0,
    100,
    "DEV_PORT_FALLBACK_SPAN"
  );

  return Object.freeze({
    preferredPort,
    allowPortFallback:
      env.NODE_ENV !== "production" && fallbackSpan > 0,
    fallbackSpan,
  });
}

export async function probePortAvailable(
  port: number
): Promise<boolean> {
  return new Promise(resolve => {
    const probe = net.createServer();
    let settled = false;

    const finish = (available: boolean) => {
      if (settled) return;
      settled = true;
      probe.removeAllListeners();
      resolve(available);
    };

    probe.once("error", () => finish(false));
    probe.once("listening", () => {
      probe.close(() => finish(true));
    });

    try {
      probe.listen(port);
    } catch {
      finish(false);
    }
  });
}

export async function resolveStartupPort(
  options: ServerStartupOptions,
  probe: (port: number) => Promise<boolean> = probePortAvailable
): Promise<number> {
  if (!options.allowPortFallback) {
    return options.preferredPort;
  }

  const upper = Math.min(
    65_535,
    options.preferredPort + options.fallbackSpan
  );

  for (let port = options.preferredPort; port <= upper; port += 1) {
    if (await probe(port)) return port;
  }

  throw new Error(
    "No development port is available from " +
      options.preferredPort +
      " through " +
      upper
  );
}

export async function listenHttpServer(
  server: Server,
  port: number
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      server.off("error", onError);
      server.off("listening", onListening);
    };
    const finish = (
      outcome: "resolve" | "reject",
      error?: Error
    ) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (outcome === "resolve") resolve();
      else reject(error ?? new Error("HTTP server listen failed"));
    };
    const onError = (error: Error) => {
      finish("reject", error);
    };
    const onListening = () => {
      finish("resolve");
    };

    server.once("error", onError);
    server.once("listening", onListening);

    try {
      server.listen(port);
    } catch (error) {
      finish(
        "reject",
        error instanceof Error ? error : new Error(String(error))
      );
    }
  });
}

export function sanitizeStartupError(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.name + ": " + error.message
      : String(error);

  return raw
    .replace(
      /([a-z][a-z0-9+.-]*:\/\/)([^\s/:@]+):([^\s/@]+)@/gi,
      "$1[redacted]@"
    )
    .replace(
      /([?&](?:password|passwd|pwd)=)[^&\s]+/gi,
      "$1[redacted]"
    )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2_000);
}

export async function handleStartupFailure(
  input: Readonly<{
    error: unknown;
    cleanup: () => Promise<void> | void;
    setExitCode?: (code: number) => void;
    log?: (message: string) => void;
  }>
): Promise<void> {
  const setExitCode =
    input.setExitCode ?? (code => {
      process.exitCode = code;
    });
  const log =
    input.log ??
    (message => {
      console.error(message);
    });

  setExitCode(1);
  log("[Startup] " + sanitizeStartupError(input.error));

  try {
    await input.cleanup();
  } catch (cleanupError) {
    log(
      "[Startup] cleanup failed: " +
        sanitizeStartupError(cleanupError)
    );
  }
}
