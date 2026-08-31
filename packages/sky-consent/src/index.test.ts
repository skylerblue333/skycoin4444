import { describe, expect, it } from "vitest";
import {
  decideConsent,
  latestConsentByPurpose,
  validateConsentRecord,
} from "./index";

const granted = {
  subjectId: "user:42",
  purpose: "analytics" as const,
  state: "granted" as const,
  policyVersion: "2026-08",
  recordedAt: "2026-08-25T09:00:00.000Z",
  source: "user" as const,
};

describe("SkyConsent", () => {
  it("defaults optional purposes to denied when consent is missing", () => {
    expect(decideConsent("marketing", "2026-08", [])).toEqual({
      allowed: false,
      reason: "missing",
    });
  });

  it("always permits essential processing", () => {
    expect(decideConsent("essential", "2026-08", [])).toEqual({
      allowed: true,
      reason: "essential",
    });
  });

  it("uses the latest record and rejects stale policy versions", () => {
    const denied = {
      ...granted,
      state: "denied" as const,
      recordedAt: "2026-08-25T10:00:00.000Z",
    };
    expect(decideConsent("analytics", "2026-08", [granted, denied])).toEqual({
      allowed: false,
      reason: "denied",
    });
    expect(decideConsent("analytics", "2026-09", [granted])).toEqual({
      allowed: false,
      reason: "stale_policy",
    });
  });

  it("summarizes latest consent per purpose", () => {
    const older = {
      ...granted,
      state: "denied" as const,
      recordedAt: "2026-08-25T08:00:00.000Z",
    };
    expect(latestConsentByPurpose([older, granted]).analytics).toEqual(granted);
  });

  it("rejects malformed untrusted identifiers", () => {
    expect(() =>
      validateConsentRecord({ ...granted, subjectId: "../bad id" })
    ).toThrow("invalid subjectId");
  });

  it("rejects impossible and non-canonical timestamps", () => {
    expect(() =>
      validateConsentRecord({
        ...granted,
        recordedAt: "2026-02-31T09:00:00.000Z",
      })
    ).toThrow("invalid recordedAt");

    expect(() =>
      validateConsentRecord({
        ...granted,
        recordedAt: "2026-08-25T09:00:00Z",
      })
    ).toThrow("invalid recordedAt");

    expect(() =>
      validateConsentRecord({
        ...granted,
        recordedAt: "2026-08-25T04:00:00.000-05:00",
      })
    ).toThrow("invalid recordedAt");
  });

  it("rejects invalid runtime enum values from untyped callers", () => {
    expect(() =>
      validateConsentRecord({
        ...granted,
        purpose: "tracking" as never,
      })
    ).toThrow("invalid purpose");

    expect(() =>
      validateConsentRecord({ ...granted, state: "yes" as never })
    ).toThrow("invalid state");

    expect(() =>
      validateConsentRecord({ ...granted, source: "system" as never })
    ).toThrow("invalid source");

    expect(() => decideConsent("tracking" as never, "2026-08", [])).toThrow(
      "invalid purpose"
    );
  });
});
