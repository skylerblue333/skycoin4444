import { describe, expect, it } from "vitest";
import {
  BetaAccessRateLimiter,
  betaAccessRateLimitIssues,
  betaAccessRateLimitPolicyFromEnv,
  resolveBetaAccessClientId,
} from "./betaAccessRateLimit";

describe("beta access login rate-limit policy", () => {
  it("uses bounded engineering-beta defaults", () => {
    expect(betaAccessRateLimitPolicyFromEnv({} as NodeJS.ProcessEnv)).toEqual({
      windowMs: 300000,
      maxAttempts: 12,
      maxKeys: 4096,
      trustedClientIpHeader: "",
      scope: "process_local",
    });
  });

  it("rejects invalid numeric policy and arbitrary trusted headers", () => {
    const issues = betaAccessRateLimitIssues({
      BETA_ACCESS_RATE_LIMIT_WINDOW_MS: "9e5",
      BETA_ACCESS_RATE_LIMIT_MAX_ATTEMPTS: "2",
      BETA_ACCESS_RATE_LIMIT_MAX_KEYS: "999999",
      BETA_TRUSTED_CLIENT_IP_HEADER: "x-forwarded-for",
    } as NodeJS.ProcessEnv);

    expect(issues.map(issue => issue.key)).toEqual(
      expect.arrayContaining([
        "BETA_ACCESS_RATE_LIMIT_WINDOW_MS",
        "BETA_ACCESS_RATE_LIMIT_MAX_ATTEMPTS",
        "BETA_ACCESS_RATE_LIMIT_MAX_KEYS",
        "BETA_TRUSTED_CLIENT_IP_HEADER",
      ])
    );
  });

  it("allows the explicitly supported Railway client-IP header", () => {
    const env = {
      BETA_TRUSTED_CLIENT_IP_HEADER: "x-real-ip",
    } as NodeJS.ProcessEnv;
    const req = {
      get(name: string) {
        return name === "x-real-ip" ? "203.0.113.7" : undefined;
      },
      socket: { remoteAddress: "10.0.0.9" },
    };

    expect(resolveBetaAccessClientId(req as never, env)).toBe("203.0.113.7");
  });

  it("falls back to the socket address when a trusted header is absent or malformed", () => {
    const env = {
      BETA_TRUSTED_CLIENT_IP_HEADER: "x-real-ip",
    } as NodeJS.ProcessEnv;
    const req = {
      get() {
        return "spoofed, 203.0.113.7";
      },
      socket: { remoteAddress: "::ffff:192.0.2.44" },
    };

    expect(resolveBetaAccessClientId(req as never, env)).toBe("192.0.2.44");
  });

  it("blocks attempts after the configured threshold and resets on window expiry", () => {
    let now = 1_000;
    const limiter = new BetaAccessRateLimiter(
      {
        windowMs: 10_000,
        maxAttempts: 3,
        maxKeys: 128,
        trustedClientIpHeader: "",
        scope: "process_local",
      },
      () => now
    );

    expect(limiter.consume("198.51.100.5", "tester@example.com").allowed).toBe(true);
    expect(limiter.consume("198.51.100.5", "tester@example.com").allowed).toBe(true);
    expect(limiter.consume("198.51.100.5", "tester@example.com").allowed).toBe(true);

    const denied = limiter.consume("198.51.100.5", "tester@example.com");
    expect(denied).toMatchObject({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 10,
      scope: "process_local",
    });

    now += 10_000;
    expect(limiter.consume("198.51.100.5", "tester@example.com").allowed).toBe(true);
  });

  it("isolates counters by client and normalized email digest", () => {
    const limiter = new BetaAccessRateLimiter({
      windowMs: 10_000,
      maxAttempts: 3,
      maxKeys: 128,
      trustedClientIpHeader: "",
      scope: "process_local",
    });

    for (let attempt = 0; attempt < 3; attempt += 1) {
      expect(limiter.consume("192.0.2.1", "one@example.com").allowed).toBe(true);
    }
    expect(limiter.consume("192.0.2.1", "one@example.com").allowed).toBe(false);
    expect(limiter.consume("192.0.2.2", "one@example.com").allowed).toBe(true);
    expect(limiter.consume("192.0.2.1", "two@example.com").allowed).toBe(true);
  });

  it("keeps the in-memory key registry bounded", () => {
    const limiter = new BetaAccessRateLimiter({
      windowMs: 10_000,
      maxAttempts: 3,
      maxKeys: 128,
      trustedClientIpHeader: "",
      scope: "process_local",
    });

    for (let index = 0; index < 200; index += 1) {
      limiter.consume("192.0.2.1", `user${index}@example.com`);
    }

    expect(limiter.trackedKeyCount).toBeLessThanOrEqual(128);
  });
});
