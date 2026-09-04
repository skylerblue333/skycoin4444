import { describe, expect, it } from "vitest";
import { skycoinBetaAreas } from "../../packages/area-registry/src/index";
import { getPlatformKernelSnapshot } from "./platformKernel";

describe("integrated platform kernel", () => {
  it("covers every canonical beta area with a deterministic graph", () => {
    const first = getPlatformKernelSnapshot("2026-09-04T00:00:00.000Z");
    const second = getPlatformKernelSnapshot("2026-09-04T00:00:00.000Z");

    expect(first.graph.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(first.graph.fingerprint).toBe(second.graph.fingerprint);
    expect(first.graph.definitions).toHaveLength(skycoinBetaAreas.length);
    expect(first.runtime.assessments).toHaveLength(skycoinBetaAreas.length);
  });

  it("keeps production readiness explicitly false", () => {
    const snapshot = getPlatformKernelSnapshot("2026-09-04T00:00:00.000Z");

    expect(snapshot.productionReady).toBe(false);
    expect(snapshot.runtime.criticalPath).not.toBe("satisfied");
    expect(
      snapshot.runtime.assessments.find(item => item.id === "payments")
        ?.effectiveState
    ).not.toBe("available");
  });
});
