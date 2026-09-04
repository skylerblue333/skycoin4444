import { EventEmitter } from "node:events";
import { describe, expect, it, vi } from "vitest";
import {
  buildFatalRuntimeRecord,
  formatFatalRuntimeRecord,
  registerFatalRuntimeMonitoring,
} from "./fatalRuntime";

class FakeProcess extends EventEmitter {}

describe("fatal runtime record", () => {
  it("records only bounded redacted fatal metadata", () => {
    const record = buildFatalRuntimeRecord(
      new Error(
        "connect mysql://admin:secret@db.example/sky?password=hidden"
      ),
      "unhandledRejection",
      () => new Date("2026-09-04T17:00:00.000Z")
    );

    expect(record).toEqual({
      contract: "skycoin4444.runtime-fatal.v1",
      origin: "unhandledRejection",
      summary:
        "Error: connect mysql://[redacted]@db.example/sky?password=[redacted]",
      timestamp: "2026-09-04T17:00:00.000Z",
      recoveryAttempted: false,
      defaultCrashBehaviorPreserved: true,
    });
    expect(record.summary).not.toContain("secret");
    expect(record.summary).not.toContain("hidden");
    expect("stack" in record).toBe(false);
  });

  it("formats one newline-delimited monitoring record", () => {
    const line = formatFatalRuntimeRecord({
      contract: "skycoin4444.runtime-fatal.v1",
      origin: "uncaughtException",
      summary: "Error: boom",
      timestamp: "2026-09-04T17:00:00.000Z",
      recoveryAttempted: false,
      defaultCrashBehaviorPreserved: true,
    });

    expect(line).toMatch(/^\[FatalRuntime\] /);
    expect(line.endsWith("\n")).toBe(true);
    expect(line.split("\n")).toHaveLength(2);
  });
});

describe("fatal runtime monitoring", () => {
  it("observes uncaughtExceptionMonitor without registering a recovery handler", () => {
    const fake = new FakeProcess();
    const write = vi.fn();

    const unregister = registerFatalRuntimeMonitoring({
      process: fake as never,
      write,
      now: () => new Date("2026-09-04T17:00:00.000Z"),
    });

    expect(
      fake.listenerCount("uncaughtExceptionMonitor")
    ).toBe(1);
    expect(fake.listenerCount("uncaughtException")).toBe(0);
    expect(fake.listenerCount("unhandledRejection")).toBe(0);

    fake.emit(
      "uncaughtExceptionMonitor",
      new Error("boom"),
      "uncaughtException"
    );

    expect(write).toHaveBeenCalledWith(
      expect.stringContaining(
        '"defaultCrashBehaviorPreserved":true'
      )
    );

    unregister();
    expect(
      fake.listenerCount("uncaughtExceptionMonitor")
    ).toBe(0);
  });

  it("never throws if synchronous fatal logging itself fails", () => {
    const fake = new FakeProcess();

    registerFatalRuntimeMonitoring({
      process: fake as never,
      write: () => {
        throw new Error("stderr unavailable");
      },
    });

    expect(() =>
      fake.emit(
        "uncaughtExceptionMonitor",
        new Error("original crash"),
        "uncaughtException"
      )
    ).not.toThrow();
  });

  it("records unhandled-rejection origin without adding an unhandledRejection listener", () => {
    const fake = new FakeProcess();
    const lines: string[] = [];

    registerFatalRuntimeMonitoring({
      process: fake as never,
      write: line => lines.push(line),
      now: () => new Date("2026-09-04T17:00:00.000Z"),
    });

    fake.emit(
      "uncaughtExceptionMonitor",
      new Error("rejected"),
      "unhandledRejection"
    );

    expect(lines[0]).toContain(
      '"origin":"unhandledRejection"'
    );
    expect(
      fake.listenerCount("unhandledRejection")
    ).toBe(0);
  });
});
