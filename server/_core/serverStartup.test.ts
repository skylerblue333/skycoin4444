import { EventEmitter } from "node:events";
import { describe, expect, it, vi } from "vitest";
import {
  handleStartupFailure,
  listenHttpServer,
  resolveStartupPort,
  sanitizeStartupError,
  serverStartupOptionsFromEnv,
} from "./serverStartup";

class FakeServer extends EventEmitter {
  constructor(
    private readonly behavior: "listen" | "error" | "throw"
  ) {
    super();
  }

  listen(_port: number) {
    if (this.behavior === "throw") {
      throw new Error("synchronous listen failure");
    }
    queueMicrotask(() => {
      if (this.behavior === "listen") {
        this.emit("listening");
      } else {
        this.emit("error", new Error("EADDRINUSE"));
      }
    });
    return this;
  }
}

describe("server startup options", () => {
  it("binds production to the configured port with no fallback", () => {
    expect(
      serverStartupOptionsFromEnv({
        NODE_ENV: "production",
        PORT: "10000",
        DEV_PORT_FALLBACK_SPAN: "50",
      } as NodeJS.ProcessEnv)
    ).toEqual({
      preferredPort: 10_000,
      allowPortFallback: false,
      fallbackSpan: 50,
    });
  });

  it("allows bounded development-only port fallback", () => {
    expect(
      serverStartupOptionsFromEnv({
        NODE_ENV: "development",
        PORT: "3000",
        DEV_PORT_FALLBACK_SPAN: "12",
      } as NodeJS.ProcessEnv)
    ).toEqual({
      preferredPort: 3_000,
      allowPortFallback: true,
      fallbackSpan: 12,
    });
  });

  it("rejects malformed and out-of-range ports", () => {
    expect(() =>
      serverStartupOptionsFromEnv({
        PORT: "3000oops",
      } as NodeJS.ProcessEnv)
    ).toThrow(/PORT/);

    expect(() =>
      serverStartupOptionsFromEnv({
        PORT: "70000",
      } as NodeJS.ProcessEnv)
    ).toThrow(/PORT/);
  });
});

describe("startup port resolution", () => {
  it("never probes alternate ports in production mode", async () => {
    const probe = vi.fn(async () => false);

    await expect(
      resolveStartupPort(
        {
          preferredPort: 10_000,
          allowPortFallback: false,
          fallbackSpan: 20,
        },
        probe
      )
    ).resolves.toBe(10_000);
    expect(probe).not.toHaveBeenCalled();
  });

  it("selects the first available development port", async () => {
    const probe = vi.fn(async (port: number) => port === 3_002);

    await expect(
      resolveStartupPort(
        {
          preferredPort: 3_000,
          allowPortFallback: true,
          fallbackSpan: 5,
        },
        probe
      )
    ).resolves.toBe(3_002);
    expect(probe.mock.calls.map(([port]) => port)).toEqual([
      3_000,
      3_001,
      3_002,
    ]);
  });
});

describe("HTTP listen boundary", () => {
  it("resolves only after the server reports listening", async () => {
    await expect(
      listenHttpServer(
        new FakeServer("listen") as never,
        3_000
      )
    ).resolves.toBeUndefined();
  });

  it("rejects asynchronous and synchronous listen failures", async () => {
    await expect(
      listenHttpServer(
        new FakeServer("error") as never,
        3_000
      )
    ).rejects.toThrow("EADDRINUSE");

    await expect(
      listenHttpServer(
        new FakeServer("throw") as never,
        3_000
      )
    ).rejects.toThrow("synchronous listen failure");
  });
});

describe("startup failure handling", () => {
  it("redacts URI credentials and password query values", () => {
    const summary = sanitizeStartupError(
      new Error(
        "connect mysql://admin:supersecret@db.example/sky?password=hidden"
      )
    );

    expect(summary).not.toContain("supersecret");
    expect(summary).not.toContain("hidden");
    expect(summary).toContain("[redacted]");
  });

  it("sets failure exit code and still attempts cleanup", async () => {
    const setExitCode = vi.fn();
    const cleanup = vi.fn(async () => undefined);
    const log = vi.fn();

    await handleStartupFailure({
      error: new Error("startup broke"),
      cleanup,
      setExitCode,
      log,
    });

    expect(setExitCode).toHaveBeenCalledWith(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("startup broke")
    );
  });

  it("retains failure exit code when cleanup also fails", async () => {
    const setExitCode = vi.fn();
    const log = vi.fn();

    await handleStartupFailure({
      error: new Error("startup failure"),
      cleanup: async () => {
        throw new Error("cleanup failure");
      },
      setExitCode,
      log,
    });

    expect(setExitCode).toHaveBeenCalledWith(1);
    expect(log).toHaveBeenCalledTimes(2);
  });
});
