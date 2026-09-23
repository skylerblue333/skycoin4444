export type CharityGamingFinancialAction =
  | "deposit"
  | "withdrawal"
  | "real-money-wager"
  | "custody"
  | "token-settlement"
  | "redeemable-crypto-reward";

export interface CharityFinanceContext {
  beneficiaryId: string;
  beneficiaryVerified: boolean;
  charityOnly: true;
  paymentProviderApproved: boolean;
  legalReviewApproved: boolean;
  regionAllowed: boolean;
  ageGatePassed: boolean;
  regulatedGamingProviderApproved: boolean;
}

export interface CharityFinanceDecision {
  allowed: boolean;
  action: CharityGamingFinancialAction;
  reason:
    | "allowed-for-charity-provider-handoff"
    | "beneficiary-required"
    | "beneficiary-not-verified"
    | "charity-only-required"
    | "payment-provider-not-approved"
    | "legal-review-required"
    | "region-not-allowed"
    | "age-gate-required"
    | "regulated-gaming-provider-required";
  executeExternally: true;
}

export interface CharityFinancePlan {
  contract: "sky.charity-gaming.finance-plan.v1";
  action: CharityGamingFinancialAction;
  beneficiaryId: string;
  executeExternally: true;
  custodyBySkycoin4444: false;
  blockchainBroadcastBySkycoin4444: false;
}

const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

function normalizedBeneficiaryId(value: string): string {
  return value.trim();
}

export function evaluateCharityGamingFinance(
  action: CharityGamingFinancialAction,
  context: CharityFinanceContext,
): CharityFinanceDecision {
  const beneficiaryId = normalizedBeneficiaryId(context.beneficiaryId);

  if (!SAFE_ID.test(beneficiaryId)) {
    return { allowed: false, action, reason: "beneficiary-required", executeExternally: true };
  }
  if (context.charityOnly !== true) {
    return { allowed: false, action, reason: "charity-only-required", executeExternally: true };
  }
  if (!context.beneficiaryVerified) {
    return { allowed: false, action, reason: "beneficiary-not-verified", executeExternally: true };
  }
  if (!context.paymentProviderApproved) {
    return { allowed: false, action, reason: "payment-provider-not-approved", executeExternally: true };
  }
  if (!context.legalReviewApproved) {
    return { allowed: false, action, reason: "legal-review-required", executeExternally: true };
  }
  if (!context.regionAllowed) {
    return { allowed: false, action, reason: "region-not-allowed", executeExternally: true };
  }

  if (action === "real-money-wager") {
    if (!context.ageGatePassed) {
      return { allowed: false, action, reason: "age-gate-required", executeExternally: true };
    }
    if (!context.regulatedGamingProviderApproved) {
      return {
        allowed: false,
        action,
        reason: "regulated-gaming-provider-required",
        executeExternally: true,
      };
    }
  }

  return {
    allowed: true,
    action,
    reason: "allowed-for-charity-provider-handoff",
    executeExternally: true,
  };
}

export function planCharityGamingFinance(
  action: CharityGamingFinancialAction,
  context: CharityFinanceContext,
): CharityFinancePlan {
  const decision = evaluateCharityGamingFinance(action, context);
  if (!decision.allowed) {
    throw new Error(`charity gaming finance blocked: ${decision.reason}`);
  }

  return {
    contract: "sky.charity-gaming.finance-plan.v1",
    action,
    beneficiaryId: normalizedBeneficiaryId(context.beneficiaryId),
    executeExternally: true,
    custodyBySkycoin4444: false,
    blockchainBroadcastBySkycoin4444: false,
  };
}

export const CHARITY_GAMING_FINANCE_BOUNDARY = {
  scope: "charity-only",
  allowedActions: [
    "deposit",
    "withdrawal",
    "real-money-wager",
    "custody",
    "token-settlement",
    "redeemable-crypto-reward",
  ] as const,
  executesPayments: false,
  executesWagers: false,
  holdsCustody: false,
  broadcastsBlockchainTransactions: false,
  requiresVerifiedBeneficiary: true,
  requiresApprovedExternalProviders: true,
} as const;
