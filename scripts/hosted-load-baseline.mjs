import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { performance } from "node:perf_hooks";

const DEFAULT_ORIGIN =
  "https://skycoin4444-beta-v5-production.up.railway.app";
const ROUTES = [
  "/api/beta/readiness",
  "/api/beta/health",
  "/api/beta/auth",
];
const REQUEST_TIMEOUT_MS = 10_000;

function boundedInteger(name, fallback, minimum, maximum) {
  const raw = process.env[name];
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(
      `${name} must be an integer between ${minimum} and ${maximum}`,
    );
  }
  return value;
}

function boundedNumber(name, fallback, minimum, maximum) {
  const raw = process.env[name];
  const value = raw === undefined ? fallback : Number(raw);
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new Error(
      `${name} must be a number between ${minimum} and ${maximum}`,
    );
  }
  return value;
}

function resolveOrigin() {
  const raw = (
    process.env.HOSTED_BETA_ORIGIN ??
    process.env.BETA_PUBLIC_ORIGIN ??
    DEFAULT_ORIGIN
  ).trim();
  const url = new URL(raw);

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.pathname !== "/" && url.pathname !== "")
  ) {
    throw new Error(
      "Hosted beta origin must be an exact HTTPS origin without credentials, path, query, or fragment",
    );
  }

  return url.origin;
}

function percentile(sorted, fraction) {
  if (sorted.length === 0) return null;
  const index = Math.max(
    0,
    Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1),
  );
  return Number(sorted[index].toFixed(2));
}

async function requestJson(origin, route) {
  const started = performance.now();
  try {
    const response = await fetch(origin + route, {
      headers: {
        accept: "application/json",
        "cache-control": "no-cache",
        "user-agent": "skycoin4444-hosted-load-baseline/1",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const latencyMs = performance.now() - started;
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      // A malformed/non-JSON response is counted as an error below.
    }

    return {
      route,
      status: response.status,
      ok: response.ok && json !== null,
      latencyMs,
      json,
      error: null,
    };
  } catch (error) {
    return {
      route,
      status: null,
      ok: false,
      latencyMs: performance.now() - started,
      json: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function validatePreflight(results) {
  const byRoute = new Map(results.map(result => [result.route, result]));
  for (const route of ROUTES) {
    const result = byRoute.get(route);
    if (!result?.ok || result.status !== 200) {
      throw new Error(
        `Preflight failed for ${route}: status=${String(result?.status)} error=${result?.error ?? "invalid JSON"}`,
      );
    }
  }

  const readiness = byRoute.get("/api/beta/readiness")?.json;
  const health = byRoute.get("/api/beta/health")?.json;
  const auth = byRoute.get("/api/beta/auth")?.json;

  if (
    readiness?.status !== "ready" ||
    readiness?.database !== "ok" ||
    readiness?.configuration !== "ok" ||
    readiness?.releaseSource !== "railway" ||
    typeof readiness?.releaseSha !== "string" ||
    readiness.releaseSha.length < 7
  ) {
    throw new Error("Hosted readiness release/database/configuration contract failed");
  }
  if (health?.status !== "ok") {
    throw new Error("Hosted health contract failed");
  }
  if (auth?.configured !== true || auth?.invitationRequired !== true) {
    throw new Error("Hosted auth contract failed");
  }

  return {
    releaseSha: readiness.releaseSha,
    releaseSource: readiness.releaseSource,
    authMode: auth.mode,
  };
}

async function main() {
  const origin = resolveOrigin();
  const totalRequests = boundedInteger(
    "LOAD_TOTAL_REQUESTS",
    180,
    30,
    2_000,
  );
  const concurrency = boundedInteger("LOAD_CONCURRENCY", 6, 1, 25);
  const warmupRequests = boundedInteger("LOAD_WARMUP_REQUESTS", 12, 0, 100);
  const maxErrorRate = boundedNumber("LOAD_MAX_ERROR_RATE", 0, 0, 1);
  const p95LimitMs = boundedNumber("LOAD_P95_LIMIT_MS", 1_500, 1, 30_000);
  const p99LimitMs = boundedNumber("LOAD_P99_LIMIT_MS", 3_000, 1, 30_000);

  const preflight = await Promise.all(
    ROUTES.map(route => requestJson(origin, route)),
  );
  const release = validatePreflight(preflight);

  for (let index = 0; index < warmupRequests; index += 1) {
    const result = await requestJson(origin, ROUTES[index % ROUTES.length]);
    if (!result.ok || result.status !== 200) {
      throw new Error(
        `Warmup failed for ${result.route}: status=${String(result.status)} error=${result.error ?? "invalid JSON"}`,
      );
    }
  }

  const results = new Array(totalRequests);
  let cursor = 0;
  const started = performance.now();

  async function worker() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= totalRequests) return;

      const route = ROUTES[index % ROUTES.length];
      results[index] = await requestJson(origin, route);
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, () => worker()),
  );

  const durationMs = performance.now() - started;
  const latencies = results
    .map(result => result.latencyMs)
    .sort((left, right) => left - right);
  const failures = results.filter(
    result => !result.ok || result.status !== 200,
  );
  const statusCounts = {};
  const routeStats = {};

  for (const result of results) {
    const statusKey = result.status === null ? "network_error" : String(result.status);
    statusCounts[statusKey] = (statusCounts[statusKey] ?? 0) + 1;

    const stats = routeStats[result.route] ?? {
      requests: 0,
      errors: 0,
      latencies: [],
    };
    stats.requests += 1;
    if (!result.ok || result.status !== 200) stats.errors += 1;
    stats.latencies.push(result.latencyMs);
    routeStats[result.route] = stats;
  }

  const normalizedRouteStats = Object.fromEntries(
    Object.entries(routeStats).map(([route, stats]) => {
      const sorted = [...stats.latencies].sort((left, right) => left - right);
      return [
        route,
        {
          requests: stats.requests,
          errors: stats.errors,
          p50Ms: percentile(sorted, 0.5),
          p95Ms: percentile(sorted, 0.95),
          p99Ms: percentile(sorted, 0.99),
        },
      ];
    }),
  );

  const errorRate = failures.length / totalRequests;
  const report = {
    contract: "skycoin4444.hosted-load-baseline.v1",
    measuredAt: new Date().toISOString(),
    origin,
    release,
    requestPlan: {
      routes: ROUTES,
      totalRequests,
      concurrency,
      warmupRequests,
      requestTimeoutMs: REQUEST_TIMEOUT_MS,
    },
    results: {
      durationMs: Number(durationMs.toFixed(2)),
      requestsPerSecond: Number(
        (totalRequests / (durationMs / 1000)).toFixed(2),
      ),
      successes: totalRequests - failures.length,
      errors: failures.length,
      errorRate: Number(errorRate.toFixed(6)),
      p50Ms: percentile(latencies, 0.5),
      p95Ms: percentile(latencies, 0.95),
      p99Ms: percentile(latencies, 0.99),
      statusCounts,
      routes: normalizedRouteStats,
    },
    thresholds: {
      maxErrorRate,
      p95LimitMs,
      p99LimitMs,
    },
    limitations: [
      "read-only public health/readiness/auth endpoints only",
      "single short bounded run, not sustained capacity certification",
      "does not exercise authenticated writes, payment, custody, blockchain, or external provider execution",
      "does not prove autoscaling, multi-region failover, or dependency outage recovery",
    ],
  };

  fs.mkdirSync(path.resolve("artifacts"), { recursive: true });
  fs.writeFileSync(
    path.resolve("artifacts/hosted-load-baseline.json"),
    JSON.stringify(report, null, 2) + "\n",
    "utf8",
  );

  console.log("HOSTED_LOAD_BASELINE " + JSON.stringify(report));

  const thresholdFailures = [];
  if (errorRate > maxErrorRate) {
    thresholdFailures.push(
      `errorRate ${errorRate.toFixed(6)} > ${maxErrorRate}`,
    );
  }
  if ((report.results.p95Ms ?? Infinity) > p95LimitMs) {
    thresholdFailures.push(
      `p95 ${report.results.p95Ms}ms > ${p95LimitMs}ms`,
    );
  }
  if ((report.results.p99Ms ?? Infinity) > p99LimitMs) {
    thresholdFailures.push(
      `p99 ${report.results.p99Ms}ms > ${p99LimitMs}ms`,
    );
  }

  if (thresholdFailures.length > 0) {
    throw new Error(
      "Hosted load baseline threshold failure: " +
        thresholdFailures.join("; "),
    );
  }
}

main().catch(error => {
  console.error(
    "Hosted load baseline failed:",
    error instanceof Error ? error.message : String(error),
  );
  process.exitCode = 1;
});
