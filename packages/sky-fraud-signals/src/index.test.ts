import { describe, expect, it } from "vitest";
import { evaluateFraudSignals, toFraudSignalEvent } from "./index";

describe("SkyFraudSignals", () => {
  it("returns deterministic advisory signals", () => {
    const result = evaluateFraudSignals({ transactionId: "txn_001", amountMinor: 600000, currency: "USD", accountAgeDays: 2, failedAttempts24h: 4, countryChanged: true });
    expect(result).toEqual({ transactionId: "txn_001", score: 100, band: "elevated", signals: ["high_amount", "new_account", "repeated_failures", "country_change"] });
  });
  it("keeps ordinary input low risk", () => {
    expect(evaluateFraudSignals({ transactionId: "txn_002", amountMinor: 2500, currency: "USD", accountAgeDays: 365, failedAttempts24h: 0, countryChanged: false }).band).toBe("low");
  });
  it("rejects malformed caller-supplied values", () => {
    expect(() => evaluateFraudSignals({ transactionId: "x", amountMinor: -1, currency: "usd", accountAgeDays: -1, failedAttempts24h: 0, countryChanged: false })).toThrow();
  });
  it("exports an integration event without asserting fraud", () => {
    const event = toFraudSignalEvent(evaluateFraudSignals({ transactionId: "txn_003", amountMinor: 500000, currency: "USD", accountAgeDays: 100, failedAttempts24h: 0, countryChanged: false }));
    expect(event.type).toBe("fraud.signals_evaluated");
    expect(event.band).toBe("review");
  });
});
