import { describe, expect, it } from "vitest";
import { reconcile, reconciliationSummary, validateRecord } from "./index";

const internal = {
  id: "ledger:1",
  externalRef: "tx:abc",
  amountMinor: 1250,
  currency: "USD",
};
const external = {
  id: "provider:9",
  externalRef: "tx:abc",
  amountMinor: 1250,
  currency: "USD",
};

describe("SkyReconciliation", () => {
  it("matches equal caller-supplied records", () => {
    expect(reconcile([internal], [external])).toEqual([
      {
        recordId: "ledger:1",
        status: "matched",
        externalId: "provider:9",
      },
    ]);
  });

  it("detects missing, mismatched, and duplicate references", () => {
    expect(reconcile([internal], [])[0]?.status).toBe("missing_external");
    expect(
      reconcile([internal], [{ ...external, amountMinor: 1300 }])[0]?.status
    ).toBe("amount_mismatch");
    expect(
      reconcile([internal], [external, { ...external, id: "provider:10" }])[0]
        ?.status
    ).toBe("duplicate_external_ref");
  });

  it("summarizes reconciliation outcomes", () => {
    const results = reconcile(
      [
        { ...internal },
        { ...internal, id: "ledger:2", externalRef: "tx:none" },
      ],
      [external]
    );
    expect(reconciliationSummary(results)).toEqual({
      matched: 1,
      amount_mismatch: 0,
      missing_external: 1,
      duplicate_external_ref: 0,
    });
  });

  it("requires integer minor units and ISO-like currencies", () => {
    expect(() => validateRecord({ ...internal, amountMinor: 1.2 })).toThrow(
      "safe integer"
    );
    expect(() => validateRecord({ ...internal, currency: "usd" })).toThrow(
      "invalid currency"
    );
  });
});
