import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const baselinePath = "catalogs/dependency-audit-baseline.json";
const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
const lockfile = await readFile(baseline.lockfilePath);

function gitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`);
  return createHash("sha1").update(header).update(buffer).digest("hex");
}

function verifyBaseline(reason) {
  const actual = gitBlobSha(lockfile);
  if (baseline.auditConclusion !== "success") {
    throw new Error("Dependency audit baseline is not recorded as successful.");
  }
  if (actual !== baseline.lockfileGitBlobSha) {
    throw new Error(
      `Live dependency audit unavailable and lockfile changed. Expected ${baseline.lockfileGitBlobSha}, got ${actual}. Fresh audit required.`
    );
  }
  console.log(
    `Live dependency audit unavailable (${reason}). Reusing documented green audit evidence run ${baseline.evidenceRunId} because ${baseline.lockfilePath} is byte-for-byte identical (${actual}).`
  );
}

const audit = spawnSync(
  "pnpm",
  ["audit", "--prod", "--audit-level", "high", "--json"],
  {
    encoding: "utf8",
    timeout: 90_000,
    env: {
      ...process.env,
      NPM_CONFIG_FETCH_TIMEOUT: "30000",
      NPM_CONFIG_FETCH_RETRIES: "1",
    },
  }
);

if (audit.status === 0) {
  console.log("Live production dependency audit passed.");
  process.exit(0);
}

let parsed = null;
try {
  parsed = audit.stdout?.trim() ? JSON.parse(audit.stdout) : null;
} catch {
  parsed = null;
}

const vulnerabilities = parsed?.metadata?.vulnerabilities;
if (vulnerabilities) {
  const high = Number(vulnerabilities.high ?? 0);
  const critical = Number(vulnerabilities.critical ?? 0);
  if (high > 0 || critical > 0) {
    console.error(audit.stdout);
    throw new Error(
      `Production dependency audit reported ${high} high and ${critical} critical vulnerabilities.`
    );
  }
}

const combined = [audit.stdout, audit.stderr, audit.error?.message]
  .filter(Boolean)
  .join("\n");
const registryUnavailable =
  audit.error?.code === "ETIMEDOUT" ||
  /security\/advisories\/bulk|ERR_PNPM_AUDIT_BAD_RESPONSE|fetch failed|timeout|timed out|ECONNRESET|ENETUNREACH|EAI_AGAIN|error \(23\)/i.test(
    combined
  );

if (!registryUnavailable) {
  console.error(combined);
  throw new Error(
    `Dependency audit failed for a non-registry reason (exit ${audit.status ?? "unknown"}).`
  );
}

verifyBaseline(audit.error?.code ?? "registry/network failure");
