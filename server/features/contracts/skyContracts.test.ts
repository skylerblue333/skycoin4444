import { describe, expect, it } from "vitest";
import { createContractRecord, isContractInForce } from "./skyContracts";

describe("SkyContracts", () => {
  const contract = createContractRecord({
    id: "contract:1",
    organizationId: "org:sky",
    counterpartyId: "org:partner",
    title: "Integration services",
    effectiveAtMs: 100,
    expiresAtMs: 200,
    status: "active",
  });

  it("normalizes and validates contract metadata", () => {
    expect(contract.title).toBe("Integration services");
    expect(contract.status).toBe("active");
  });

  it("evaluates active windows deterministically", () => {
    expect(isContractInForce(contract, 150)).toBe(true);
    expect(isContractInForce(contract, 200)).toBe(false);
  });

  it("treats terminated contracts as out of force", () => {
    expect(
      isContractInForce({ ...contract, status: "terminated" }, 150)
    ).toBe(false);
  });

  it("rejects invalid document digests", () => {
    expect(() =>
      createContractRecord({
        id: "contract:2",
        organizationId: "org:sky",
        counterpartyId: "org:partner",
        title: "Agreement",
        effectiveAtMs: 100,
        status: "draft",
        documentHash: "bad-hash",
      })
    ).toThrow("documentHash must be a 64-character hex digest");
  });
});
