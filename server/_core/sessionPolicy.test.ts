import { describe, expect, it } from "vitest";
import {
  resolveSessionTtlMs,
  sessionLifetimePolicyFromEnv,
  validateSessionTtlMs,
} from "./sessionPolicy";

describe("session lifetime policy", () => {
  it("uses a seven-day bounded engineering-beta default", () => {
    expect(
      sessionLifetimePolicyFromEnv({} as NodeJS.ProcessEnv)
    ).toEqual({
      ttlMs: 604_800_000,
      minTtlMs: 900_000,
      maxTtlMs: 2_592_000_000,
      serverSideRevocationBacked: false,
    });
  });

  it("accepts a bounded explicit lifetime", () => {
    expect(
      sessionLifetimePolicyFromEnv({
        SESSION_TTL_MS: "86400000",
      } as NodeJS.ProcessEnv).ttlMs
    ).toBe(86_400_000);
  });

  it("rejects malformed, too-short, and excessive lifetimes", () => {
    expect(() =>
      sessionLifetimePolicyFromEnv({
        SESSION_TTL_MS: "not-a-number",
      } as NodeJS.ProcessEnv)
    ).toThrow(/SESSION_TTL_MS/);
    expect(() =>
      sessionLifetimePolicyFromEnv({
        SESSION_TTL_MS: "9e5",
      } as NodeJS.ProcessEnv)
    ).toThrow(/decimal digits/);
    expect(() =>
      sessionLifetimePolicyFromEnv({
        SESSION_TTL_MS: "900000.0",
      } as NodeJS.ProcessEnv)
    ).toThrow(/decimal digits/);

    expect(() => validateSessionTtlMs(60_000)).toThrow(
      /SESSION_TTL_MS/
    );
    expect(() => validateSessionTtlMs(2_592_000_001)).toThrow(
      /SESSION_TTL_MS/
    );
  });

  it("applies the same bound to caller-requested JWT lifetimes", () => {
    expect(resolveSessionTtlMs(3_600_000)).toBe(3_600_000);
    expect(() => resolveSessionTtlMs(31 * 24 * 60 * 60 * 1_000)).toThrow(
      /expiresInMs/
    );
  });
});
