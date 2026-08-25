import { describe, expect, it } from "vitest";
import { canSatisfyDecision, evaluateMfa, type MfaPolicy } from "./index";

const policy: MfaPolicy = {
  requiredActions: ["wallet.withdraw", "account.password.change"],
  riskThreshold: 70,
  phishingResistantActions: ["wallet.withdraw"],
};

const factors = [
  { factor: "totp" as const, enabled: true, verifiedAt: "2026-08-25T00:00:00Z" },
  { factor: "passkey" as const, enabled: true, verifiedAt: "2026-08-25T00:00:00Z" },
];

describe("SkyMFA policy core", () => {
  it("requires a passkey for phishing-resistant sensitive actions", () => {
    const decision = evaluateMfa(
      { userId: "user-1", primaryAuthenticated: true, requestedAction: "wallet.withdraw", riskScore: 10 },
      factors,
      policy,
    );
    expect(decision.required).toBe(true);
    expect(decision.requiredAssurance).toBe("phishing_resistant");
    expect(decision.eligibleFactors).toEqual(["passkey"]);
    expect(canSatisfyDecision(decision)).toBe(true);
  });

  it("requires MFA when caller-supplied risk meets the configured threshold", () => {
    const decision = evaluateMfa(
      { userId: "user-2", primaryAuthenticated: true, requestedAction: "profile.read", riskScore: 70 },
      factors,
      policy,
    );
    expect(decision.reason).toBe("elevated_risk");
    expect(decision.requiredAssurance).toBe("multi_factor");
  });

  it("does not pretend MFA substitutes for primary authentication", () => {
    const decision = evaluateMfa(
      { userId: "user-3", primaryAuthenticated: false, requestedAction: "wallet.withdraw", riskScore: 100 },
      factors,
      policy,
    );
    expect(decision.required).toBe(false);
    expect(decision.reason).toBe("primary_auth_missing");
  });

  it("rejects invalid untrusted risk input", () => {
    expect(() =>
      evaluateMfa(
        { userId: "user-4", primaryAuthenticated: true, requestedAction: "profile.read", riskScore: 101 },
        factors,
        policy,
      ),
    ).toThrow(RangeError);
  });

  it("reports unsatisfied policy when no eligible factor exists", () => {
    const decision = evaluateMfa(
      { userId: "user-5", primaryAuthenticated: true, requestedAction: "wallet.withdraw" },
      [{ factor: "totp", enabled: true, verifiedAt: "2026-08-25T00:00:00Z" }],
      policy,
    );
    expect(canSatisfyDecision(decision)).toBe(false);
  });
});
