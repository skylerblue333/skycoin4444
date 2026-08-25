import { describe, expect, it } from "vitest";
import {
  derivePresence,
  latestHeartbeat,
  validatePresencePolicy,
} from "./index";

const policy = { onlineWithinMs: 60_000, awayWithinMs: 300_000 };
const heartbeat = {
  subjectId: "user:42",
  deviceId: "device:1",
  observedAt: "2026-08-25T09:00:00.000Z",
};

describe("SkyPresence", () => {
  it("derives online, away, and offline deterministically", () => {
    expect(
      derivePresence(heartbeat, "2026-08-25T09:00:30.000Z", policy),
    ).toBe("online");
    expect(
      derivePresence(heartbeat, "2026-08-25T09:03:00.000Z", policy),
    ).toBe("away");
    expect(
      derivePresence(heartbeat, "2026-08-25T09:06:00.000Z", policy),
    ).toBe("offline");
  });

  it("returns offline with no heartbeat", () => {
    expect(
      derivePresence(undefined, "2026-08-25T09:00:00.000Z", policy),
    ).toBe("offline");
  });

  it("selects the latest heartbeat", () => {
    const newer = {
      ...heartbeat,
      observedAt: "2026-08-25T09:01:00.000Z",
    };
    expect(latestHeartbeat([heartbeat, newer])).toEqual(newer);
  });

  it("rejects invalid thresholds and future observations", () => {
    expect(() =>
      validatePresencePolicy({ onlineWithinMs: 100, awayWithinMs: 99 }),
    ).toThrow("invalid awayWithinMs");
    expect(() =>
      derivePresence(heartbeat, "2026-08-25T08:59:59.000Z", policy),
    ).toThrow("future");
  });
});
