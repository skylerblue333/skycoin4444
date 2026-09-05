import { createHash } from "node:crypto";
import { isIP } from "node:net";
import type { Request } from "express";

const DEFAULT_WINDOW_MS = 5 * 60 * 1_000;
const MIN_WINDOW_MS = 10_000;
const MAX_WINDOW_MS = 60 * 60 * 1_000;
const DEFAULT_MAX_ATTEMPTS = 12;
const MIN_MAX_ATTEMPTS = 3;
const MAX_MAX_ATTEMPTS = 100;
const DEFAULT_MAX_KEYS = 4_096;
const MIN_MAX_KEYS = 128;
const MAX_MAX_KEYS = 50_000;
const TRUSTED_CLIENT_IP_HEADER = "x-real-ip";

export type BetaAccessRateLimitPolicy = Readonly<{
  windowMs: number;
  maxAttempts: number;
  maxKeys: number;
  trustedClientIpHeader: "" | "x-real-ip";
  scope: "process_local";
}>;

export type BetaAccessRateLimitIssue = Readonly<{
  key:
    | "BETA_ACCESS_RATE_LIMIT_WINDOW_MS"
    | "BETA_ACCESS_RATE_LIMIT_MAX_ATTEMPTS"
    | "BETA_ACCESS_RATE_LIMIT_MAX_KEYS"
    | "BETA_TRUSTED_CLIENT_IP_HEADER";
  message: string;
}>;

export type BetaAccessRateLimitDecision = Readonly<{
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
  scope: "process_local";
}>;

type Entry = {
  count: number;
  windowStartedAt: number;
};

function parseBoundedInteger(
  env: NodeJS.ProcessEnv,
  key: string,
  fallback: number,
  min: number,
  max: number
): number {
  const raw = env[key]?.trim();
  if (!raw) return fallback;
  if (!/^\d+$/.test(raw)) {
    throw new RangeError(`${key} must contain decimal digits only`);
  }

  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new RangeError(
      `${key} must be an integer between ${min} and ${max}`
    );
  }
  return value;
}

function trustedClientIpHeader(
  env: NodeJS.ProcessEnv
): "" | "x-real-ip" {
  const raw = env.BETA_TRUSTED_CLIENT_IP_HEADER?.trim().toLowerCase() ?? "";
  if (!raw) return "";
  if (raw !== TRUSTED_CLIENT_IP_HEADER) {
    throw new RangeError(
      "BETA_TRUSTED_CLIENT_IP_HEADER may only be x-real-ip"
    );
  }
  return TRUSTED_CLIENT_IP_HEADER;
}

export function betaAccessRateLimitPolicyFromEnv(
  env: NodeJS.ProcessEnv = process.env
): BetaAccessRateLimitPolicy {
  return Object.freeze({
    windowMs: parseBoundedInteger(
      env,
      "BETA_ACCESS_RATE_LIMIT_WINDOW_MS",
      DEFAULT_WINDOW_MS,
      MIN_WINDOW_MS,
      MAX_WINDOW_MS
    ),
    maxAttempts: parseBoundedInteger(
      env,
      "BETA_ACCESS_RATE_LIMIT_MAX_ATTEMPTS",
      DEFAULT_MAX_ATTEMPTS,
      MIN_MAX_ATTEMPTS,
      MAX_MAX_ATTEMPTS
    ),
    maxKeys: parseBoundedInteger(
      env,
      "BETA_ACCESS_RATE_LIMIT_MAX_KEYS",
      DEFAULT_MAX_KEYS,
      MIN_MAX_KEYS,
      MAX_MAX_KEYS
    ),
    trustedClientIpHeader: trustedClientIpHeader(env),
    scope: "process_local" as const,
  });
}

export function betaAccessRateLimitIssues(
  env: NodeJS.ProcessEnv = process.env
): BetaAccessRateLimitIssue[] {
  const issues: BetaAccessRateLimitIssue[] = [];
  const checks: Array<{
    key: BetaAccessRateLimitIssue["key"];
    run: () => unknown;
  }> = [
    {
      key: "BETA_ACCESS_RATE_LIMIT_WINDOW_MS",
      run: () =>
        parseBoundedInteger(
          env,
          "BETA_ACCESS_RATE_LIMIT_WINDOW_MS",
          DEFAULT_WINDOW_MS,
          MIN_WINDOW_MS,
          MAX_WINDOW_MS
        ),
    },
    {
      key: "BETA_ACCESS_RATE_LIMIT_MAX_ATTEMPTS",
      run: () =>
        parseBoundedInteger(
          env,
          "BETA_ACCESS_RATE_LIMIT_MAX_ATTEMPTS",
          DEFAULT_MAX_ATTEMPTS,
          MIN_MAX_ATTEMPTS,
          MAX_MAX_ATTEMPTS
        ),
    },
    {
      key: "BETA_ACCESS_RATE_LIMIT_MAX_KEYS",
      run: () =>
        parseBoundedInteger(
          env,
          "BETA_ACCESS_RATE_LIMIT_MAX_KEYS",
          DEFAULT_MAX_KEYS,
          MIN_MAX_KEYS,
          MAX_MAX_KEYS
        ),
    },
    {
      key: "BETA_TRUSTED_CLIENT_IP_HEADER",
      run: () => trustedClientIpHeader(env),
    },
  ];

  for (const check of checks) {
    try {
      check.run();
    } catch (error) {
      issues.push({
        key: check.key,
        message:
          error instanceof Error
            ? error.message
            : `${check.key} is invalid`,
      });
    }
  }

  return issues;
}

function normalizeIp(value: string | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.includes(",")) return null;

  const withoutMappedPrefix = candidate.startsWith("::ffff:")
    ? candidate.slice("::ffff:".length)
    : candidate;

  return isIP(withoutMappedPrefix) ? withoutMappedPrefix : null;
}

export function resolveBetaAccessClientId(
  req: Pick<Request, "get" | "socket">,
  env: NodeJS.ProcessEnv = process.env
): string {
  const policy = betaAccessRateLimitPolicyFromEnv(env);
  const trustedHeaderIp = policy.trustedClientIpHeader
    ? normalizeIp(req.get(policy.trustedClientIpHeader))
    : null;
  const socketIp = normalizeIp(req.socket.remoteAddress);

  return trustedHeaderIp ?? socketIp ?? "unknown-client";
}

function digestKey(clientId: string, normalizedEmail: string): string {
  return createHash("sha256")
    .update(clientId, "utf8")
    .update("\n", "utf8")
    .update(normalizedEmail, "utf8")
    .digest("hex");
}

export class BetaAccessRateLimiter {
  private readonly entries = new Map<string, Entry>();

  constructor(
    readonly policy: BetaAccessRateLimitPolicy,
    private readonly now: () => number = Date.now
  ) {}

  consume(
    clientId: string,
    normalizedEmail: string
  ): BetaAccessRateLimitDecision {
    const now = this.now();
    const key = digestKey(clientId, normalizedEmail);
    let entry = this.entries.get(key);

    if (!entry || now - entry.windowStartedAt >= this.policy.windowMs) {
      this.makeCapacity();
      entry = { count: 0, windowStartedAt: now };
      this.entries.set(key, entry);
    }

    const elapsed = Math.max(0, now - entry.windowStartedAt);
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((this.policy.windowMs - elapsed) / 1_000)
    );

    if (entry.count >= this.policy.maxAttempts) {
      return Object.freeze({
        allowed: false,
        retryAfterSeconds,
        remaining: 0,
        scope: "process_local" as const,
      });
    }

    entry.count += 1;
    return Object.freeze({
      allowed: true,
      retryAfterSeconds,
      remaining: Math.max(0, this.policy.maxAttempts - entry.count),
      scope: "process_local" as const,
    });
  }

  get trackedKeyCount(): number {
    return this.entries.size;
  }

  private makeCapacity() {
    if (this.entries.size < this.policy.maxKeys) return;

    const now = this.now();
    for (const [key, entry] of this.entries) {
      if (now - entry.windowStartedAt >= this.policy.windowMs) {
        this.entries.delete(key);
      }
    }

    while (this.entries.size >= this.policy.maxKeys) {
      const oldestKey = this.entries.keys().next().value as string | undefined;
      if (!oldestKey) break;
      this.entries.delete(oldestKey);
    }
  }
}

let runtimeLimiter:
  | {
      signature: string;
      limiter: BetaAccessRateLimiter;
    }
  | undefined;

function policySignature(policy: BetaAccessRateLimitPolicy): string {
  return [
    policy.windowMs,
    policy.maxAttempts,
    policy.maxKeys,
    policy.trustedClientIpHeader,
  ].join(":");
}

function runtimeRateLimiter(
  env: NodeJS.ProcessEnv = process.env
): BetaAccessRateLimiter {
  const policy = betaAccessRateLimitPolicyFromEnv(env);
  const signature = policySignature(policy);

  if (!runtimeLimiter || runtimeLimiter.signature !== signature) {
    runtimeLimiter = {
      signature,
      limiter: new BetaAccessRateLimiter(policy),
    };
  }

  return runtimeLimiter.limiter;
}

export function consumeBetaAccessAttempt(
  req: Pick<Request, "get" | "socket">,
  normalizedEmail: string,
  env: NodeJS.ProcessEnv = process.env
): BetaAccessRateLimitDecision {
  return runtimeRateLimiter(env).consume(
    resolveBetaAccessClientId(req, env),
    normalizedEmail
  );
}
