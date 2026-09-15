import { describe, expect, it } from "vitest";
import {
  addWeb3IntentSimulation,
  analyzeWeb3Intent,
  createWeb3IntentSimulation,
  formatWeb3Minor,
  normalizeWeb3IntentHistory,
  normalizeWeb3SafetyChecks,
  web3IntentSafetyChecks,
} from "./web3IntentLab";

const allChecks = web3IntentSafetyChecks.map(check => check.id);

function readyInput() {
  return {
    asset: "SKYTEST" as const,
    network: "testnet" as const,
    recipientReference: "recipient:test-alpha",
    amount: "12.3456789",
    feeScenario: "standard" as const,
    acknowledgedChecks: allChecks,
  };
}

describe("Web3 intent simulation lab", () => {
  it("formats fixed 8-decimal fixture units deterministically", () => {
    expect(formatWeb3Minor(0)).toBe("0.00000000");
    expect(formatWeb3Minor(123_456_789)).toBe("1.23456789");
    expect(() => formatWeb3Minor(-1)).toThrow(/non-negative safe integer/);
  });

  it("normalizes acknowledgements to the controlled safety set", () => {
    expect(normalizeWeb3SafetyChecks(["recipient", "recipient", "network", "unknown", 42])).toEqual([
      "recipient",
      "network",
    ]);
  });

  it("blocks asset-network mismatch and incomplete safety review", () => {
    const analysis = analyzeWeb3Intent({
      ...readyInput(),
      asset: "SKY444",
      acknowledgedChecks: ["recipient"],
    });
    expect(analysis.canSimulate).toBe(false);
    expect(analysis.blockers.join("\n")).toMatch(/Network mismatch/);
    expect(analysis.blockers.join("\n")).toMatch(/Confirm:/);
  });

  it("rejects recovery-material-like recipient input", () => {
    const secret = analyzeWeb3Intent({
      ...readyInput(),
      recipientReference: "private key abc123",
    });
    expect(secret.canSimulate).toBe(false);
    expect(secret.blockers.join("\n")).toMatch(/Do not paste recovery material/);

    const longWords = analyzeWeb3Intent({
      ...readyInput(),
      recipientReference: "one two three four five six seven eight nine ten eleven twelve",
    });
    expect(longWords.blockers.join("\n")).toMatch(/recovery material/);
  });

  it("bounds display amounts to positive values with eight decimals", () => {
    expect(analyzeWeb3Intent({ ...readyInput(), amount: "0" }).canSimulate).toBe(false);
    expect(analyzeWeb3Intent({ ...readyInput(), amount: "1.123456789" }).canSimulate).toBe(false);
    expect(analyzeWeb3Intent({ ...readyInput(), amount: "1000001" }).canSimulate).toBe(false);
    expect(analyzeWeb3Intent(readyInput()).canSimulate).toBe(true);
  });

  it("creates a no-signature, no-broadcast, no-custody simulation receipt", () => {
    const receipt = createWeb3IntentSimulation(
      readyInput(),
      "2026-09-15T18:00:00.000Z"
    );
    expect(receipt.contract).toBe("sky.web3.intent-simulation.v1");
    expect(receipt.amountDisplay).toBe("12.34567890");
    expect(receipt.feeDisplay).toBe("0.00050000");
    expect(receipt.totalDisplay).toBe("12.34617890");
    expect(receipt.signatureCreated).toBe(false);
    expect(receipt.broadcastAttempted).toBe(false);
    expect(receipt.custodyCreated).toBe(false);
    expect(receipt.provenance).toBe("deterministic-local-simulation");
  });

  it("refuses to create a simulation when any blocker remains", () => {
    expect(() =>
      createWeb3IntentSimulation({
        ...readyInput(),
        acknowledgedChecks: allChecks.slice(0, -1),
      })
    ).toThrow(/Confirm:/);
  });

  it("drops corrupted history and retains only bounded simulation receipts", () => {
    const receipt = createWeb3IntentSimulation(
      readyInput(),
      "2026-09-15T18:00:00.000Z"
    );
    expect(
      normalizeWeb3IntentHistory([
        receipt,
        { ...receipt, signatureCreated: true },
        { ...receipt, provenance: "live-transaction" },
      ])
    ).toEqual([receipt]);
    expect(addWeb3IntentSimulation([], receipt)).toEqual([receipt]);
  });
});
