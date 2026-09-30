import fs from "node:fs";
import { describe, expect, it } from "vitest";

const launch = fs.readFileSync("docs/V5_BETA_LAUNCH.md", "utf8");
const workflow = fs.readFileSync(".github/workflows/hosted-load-baseline.yml", "utf8");
const harness = fs.readFileSync("scripts/hosted-load-baseline.mjs", "utf8");

describe("V5 exact-release load evidence contract", () => {
  it("documents that load tooling is not itself hosted load evidence", () => {
    expect(launch).toContain("Hosted load evidence");
    expect(launch).toContain("not");
    expect(launch).toContain("current hosted release has passed a load gate");
    expect(launch).toContain("same exact hosted SHA");
    expect(launch).toContain("not sustained-capacity");
  });

  it("pins manual hosted load runs to the workflow revision", () => {
    expect(workflow).toContain("HOSTED_LOAD_EXPECTED_SHA:");
    expect(workflow).toContain("github.event_name == 'workflow_dispatch' && github.sha || ''");
    expect(harness).toContain("HOSTED_LOAD_EXPECTED_SHA");
    expect(harness).toContain("validateHostedLoadReleaseSamples");
  });

  it("retains bounded latency, rate, error, and release-consistency evidence", () => {
    expect(harness).toContain("requestsPerSecond");
    expect(harness).toContain("p50Ms");
    expect(harness).toContain("p95Ms");
    expect(harness).toContain("p99Ms");
    expect(harness).toContain("errorRate");
    expect(harness).toContain("runReleaseConsistencyVerified: true");
    expect(workflow).toContain("artifacts/hosted-load-baseline.json");
  });
});
