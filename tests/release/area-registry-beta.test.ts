import { describe, expect, it } from "vitest";

import { assertBetaSideEffectAllowed } from "../../packages/contracts/src/index";
import {
  getBetaArea,
  skycoinBetaAreas,
} from "../../packages/area-registry/src/index";

const highRiskAreaIds = [
  "wallet",
  "market-data",
  "exchange",
  "mining",
  "bridge",
  "payments",
] as const;

describe("all-area beta registry", () => {
  it("publishes a conservative beta disposition for all 30 canonical areas", () => {
    expect(skycoinBetaAreas).toHaveLength(30);
    expect(new Set(skycoinBetaAreas.map(area => area.id)).size).toBe(30);

    for (const area of skycoinBetaAreas) {
      expect(area.requiredEvidence.length).toBeGreaterThan(0);
      expect(area.sourceOfTruth.length).toBeGreaterThan(0);
    }
  });

  it("keeps high-risk financial and blockchain areas gated or test-only", () => {
    for (const id of highRiskAreaIds) {
      const area = getBetaArea(id);
      expect(area).toBeDefined();
      expect(["controlled_test_beta", "gated_unavailable"]).toContain(
        area?.betaAvailability
      );
    }

    expect(getBetaArea("exchange")?.betaAvailability).toBe("gated_unavailable");
    expect(getBetaArea("payments")?.betaAvailability).toBe("gated_unavailable");
    expect(getBetaArea("bridge")?.betaAvailability).toBe("gated_unavailable");
  });

  it("keeps live side effects fail-closed in engineering beta", () => {
    expect(() =>
      assertBetaSideEffectAllowed("controlled_test_beta", "read_only")
    ).not.toThrow();
    expect(() =>
      assertBetaSideEffectAllowed("controlled_test_beta", "quote")
    ).not.toThrow();

    for (const sideEffect of [
      "settlement",
      "custody",
      "token_transfer",
      "chain_execution",
    ] as const) {
      expect(() =>
        assertBetaSideEffectAllowed("controlled_test_beta", sideEffect)
      ).toThrow(/disabled/);
      expect(() =>
        assertBetaSideEffectAllowed("gated_unavailable", sideEffect)
      ).toThrow(/unavailable/);
    }
  });

  it("requires provider and data-boundary evidence for AI areas", () => {
    const hopeAI = getBetaArea("hopeai");
    expect(hopeAI?.betaAvailability).toBe("controlled_test_beta");
    expect(hopeAI?.requiredEvidence.join(" ")).toMatch(/provider/i);
    expect(hopeAI?.requiredEvidence.join(" ")).toMatch(/data boundary/i);
  });
});
