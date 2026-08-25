import { describe, expect, it } from "vitest";
import { createTelemetryEvent, metricKey, sanitizeAttributes } from "./index";

describe("SkyObservability contracts", () => {
  it("creates canonical telemetry events", () => {
    const event = createTelemetryEvent({
      timestamp: "2026-08-25T04:00:00-05:00",
      service: "sky-auth",
      level: "info",
      name: "session.created",
      traceId: "abcdef0123456789",
      attributes: { status: 200, cached: false },
    });
    expect(event.timestamp).toBe("2026-08-25T09:00:00.000Z");
    expect(event.attributes).toEqual({ status: 200, cached: false });
  });

  it("drops obviously sensitive attribute names and unsupported values", () => {
    expect(sanitizeAttributes({ accessToken: "secret", password: "x", ok: "yes", nested: { x: 1 }, nan: Number.NaN })).toEqual({ ok: "yes" });
  });

  it("bounds string attributes", () => {
    expect(sanitizeAttributes({ message: "x".repeat(600) }).message).toHaveLength(512);
  });

  it("rejects invalid identifiers and trace IDs", () => {
    expect(() => createTelemetryEvent({ timestamp: "bad", service: "svc", level: "info", name: "event" })).toThrow();
    expect(() => createTelemetryEvent({ timestamp: "2026-08-25T00:00:00Z", service: "svc", level: "info", name: "event", traceId: "not-hex" })).toThrow();
    expect(() => metricKey("bad service", "requests")).toThrow();
  });
});
