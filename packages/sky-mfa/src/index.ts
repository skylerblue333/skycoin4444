export type MfaFactor = "totp" | "passkey" | "recovery_code";
export type Assurance = "single_factor" | "multi_factor" | "phishing_resistant";

export interface AuthContext {
  userId: string;
  primaryAuthenticated: boolean;
  requestedAction: string;
  riskScore?: number;
}

export interface FactorEnrollment {
  factor: MfaFactor;
  enabled: boolean;
  verifiedAt: string;
}

export interface MfaPolicy {
  requiredActions: readonly string[];
  riskThreshold: number;
  phishingResistantActions: readonly string[];
}

export interface MfaDecision {
  required: boolean;
  requiredAssurance: Assurance;
  eligibleFactors: MfaFactor[];
  reason: "primary_auth_missing" | "sensitive_action" | "elevated_risk" | "not_required";
}

const FACTORS: readonly MfaFactor[] = ["totp", "passkey", "recovery_code"];

function assertFiniteRisk(value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError("riskScore must be a finite number from 0 to 100");
  }
}

function assertNonEmpty(value: string, name: string): void {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > 200) {
    throw new TypeError(`${name} must be a non-empty string of at most 200 characters`);
  }
}

export function evaluateMfa(
  context: AuthContext,
  enrollments: readonly FactorEnrollment[],
  policy: MfaPolicy,
): MfaDecision {
  assertNonEmpty(context.userId, "userId");
  assertNonEmpty(context.requestedAction, "requestedAction");
  assertFiniteRisk(policy.riskThreshold);
  const risk = context.riskScore ?? 0;
  assertFiniteRisk(risk);

  const eligibleFactors = enrollments
    .filter((entry) => {
      if (!FACTORS.includes(entry.factor)) throw new TypeError("unsupported MFA factor");
      if (entry.enabled && !Number.isFinite(Date.parse(entry.verifiedAt))) {
        throw new TypeError("enabled MFA factors require a valid verifiedAt timestamp");
      }
      return entry.enabled;
    })
    .map((entry) => entry.factor);

  if (!context.primaryAuthenticated) {
    return { required: false, requiredAssurance: "single_factor", eligibleFactors, reason: "primary_auth_missing" };
  }

  const sensitive = policy.requiredActions.includes(context.requestedAction);
  const elevatedRisk = risk >= policy.riskThreshold;
  const required = sensitive || elevatedRisk;
  const phishingResistant = policy.phishingResistantActions.includes(context.requestedAction);

  return {
    required,
    requiredAssurance: required ? (phishingResistant ? "phishing_resistant" : "multi_factor") : "single_factor",
    eligibleFactors: phishingResistant ? eligibleFactors.filter((factor) => factor === "passkey") : eligibleFactors,
    reason: sensitive ? "sensitive_action" : elevatedRisk ? "elevated_risk" : "not_required",
  };
}

export function canSatisfyDecision(decision: MfaDecision): boolean {
  if (!decision.required) return true;
  return decision.eligibleFactors.length > 0;
}
