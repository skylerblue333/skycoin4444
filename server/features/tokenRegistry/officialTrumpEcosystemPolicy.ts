import { getOfficialTrumpCapability } from './officialTrumpCapabilities';

export type TrumpEcosystemPurpose =
  | 'asset_discovery'
  | 'portfolio_tracking'
  | 'wallet_safety'
  | 'market_information'
  | 'community_discussion'
  | 'creator_content'
  | 'commerce_handoff'
  | 'education'
  | 'developer_integration'
  | 'price_manipulation'
  | 'political_persuasion'
  | 'coordinated_inauthentic_amplification'
  | 'issuer_impersonation';

export type TrumpEcosystemSource = Readonly<{
  id: string;
  label: string;
  url: string;
  reviewedAt: '2026-09-23';
  external: true;
}>;

export type TrumpEcosystemPolicyDecision = Readonly<{
  purpose: TrumpEcosystemPurpose;
  allowed: boolean;
  reason: string;
}>;

/**
 * Reviewed external project sources. These links are references, not
 * SKYCOIN4444-owned endpoints and not evidence of a partnership.
 */
export const OFFICIAL_TRUMP_ECOSYSTEM_SOURCES: readonly TrumpEcosystemSource[] =
  Object.freeze([
    Object.freeze({
      id: 'official-site',
      label: 'Official TRUMP project website',
      url: 'https://gettrumpmemes.com/',
      reviewedAt: '2026-09-23',
      external: true,
    } as const),
    Object.freeze({
      id: 'terms',
      label: 'Official project terms',
      url: 'https://gettrumpmemes.com/terms',
      reviewedAt: '2026-09-23',
      external: true,
    } as const),
    Object.freeze({
      id: 'coin-club-terms',
      label: 'Coin Club terms',
      url: 'https://gettrumpmemes.com/terms-coin-club',
      reviewedAt: '2026-09-23',
      external: true,
    } as const),
    Object.freeze({
      id: 'reward-points',
      label: 'Reward points information',
      url: 'https://gettrumpmemes.com/reward-points',
      reviewedAt: '2026-09-23',
      external: true,
    } as const),
    Object.freeze({
      id: 'market-update',
      label: 'Market and ecosystem update',
      url: 'https://gettrumpmemes.com/market-update',
      reviewedAt: '2026-09-23',
      external: true,
    } as const),
    Object.freeze({
      id: 'coin-club',
      label: 'Coin Club',
      url: 'https://trumpclub.gettrumpmemes.com/',
      reviewedAt: '2026-09-23',
      external: true,
    } as const),
  ]);

const ALLOWED_PURPOSES: ReadonlySet<TrumpEcosystemPurpose> = new Set([
  'asset_discovery',
  'portfolio_tracking',
  'wallet_safety',
  'market_information',
  'community_discussion',
  'creator_content',
  'commerce_handoff',
  'education',
  'developer_integration',
]);

const BLOCKED_REASONS: Readonly<
  Partial<Record<TrumpEcosystemPurpose, string>>
> = Object.freeze({
  price_manipulation:
    'SKYCOIN4444 does not provide coordinated pump, wash-trading, deceptive liquidity, or other price-manipulation tooling.',
  political_persuasion:
    'SKYCOIN4444 token features must not target or persuade users about candidates, parties, voting, or civic participation.',
  coordinated_inauthentic_amplification:
    'SKYCOIN4444 does not automate deceptive or coordinated inauthentic amplification of token or political content.',
  issuer_impersonation:
    'SKYCOIN4444 must not impersonate the token issuer or present community content as an official issuer communication.',
});

export function evaluateTrumpEcosystemPurpose(
  purpose: TrumpEcosystemPurpose,
): TrumpEcosystemPolicyDecision {
  if (ALLOWED_PURPOSES.has(purpose)) {
    return Object.freeze({
      purpose,
      allowed: true,
      reason:
        'Permitted as a product purpose when existing capability/provider gates and no-affiliation boundaries are also satisfied.',
    });
  }

  return Object.freeze({
    purpose,
    allowed: false,
    reason:
      BLOCKED_REASONS[purpose] ??
      'Purpose is not approved by the SKYCOIN4444 TRUMP ecosystem policy.',
  });
}

export function assertTrumpEcosystemPurposeAllowed(
  purpose: TrumpEcosystemPurpose,
): TrumpEcosystemPolicyDecision {
  const decision = evaluateTrumpEcosystemPurpose(purpose);
  if (!decision.allowed) {
    throw new Error(`${purpose} is blocked: ${decision.reason}`);
  }
  return decision;
}

export function getOfficialTrumpEcosystemSource(
  id: string,
): TrumpEcosystemSource | undefined {
  return OFFICIAL_TRUMP_ECOSYSTEM_SOURCES.find(source => source.id === id.trim());
}

export type TrumpCapabilityUseDecision = Readonly<{
  capabilityId: string;
  purpose: TrumpEcosystemPurpose;
  allowedInEngineeringBeta: boolean;
  reason: string;
}>;

/**
 * Combined activation guard. A capability must be non-side-effecting and
 * already available as read-only/planning-only, and its intended purpose must
 * also pass the ecosystem policy.
 */
export function evaluateTrumpCapabilityUse(
  capabilityId: string,
  purpose: TrumpEcosystemPurpose,
): TrumpCapabilityUseDecision {
  const capability = getOfficialTrumpCapability(capabilityId);
  if (!capability) {
    return Object.freeze({
      capabilityId,
      purpose,
      allowedInEngineeringBeta: false,
      reason: 'Unknown capability id.',
    });
  }

  const purposeDecision = evaluateTrumpEcosystemPurpose(purpose);
  if (!purposeDecision.allowed) {
    return Object.freeze({
      capabilityId,
      purpose,
      allowedInEngineeringBeta: false,
      reason: purposeDecision.reason,
    });
  }

  if (
    capability.sideEffecting ||
    capability.availability === 'gated' ||
    capability.availability === 'external_only'
  ) {
    return Object.freeze({
      capabilityId,
      purpose,
      allowedInEngineeringBeta: false,
      reason:
        'Capability still requires provider/authority evidence or live side effects that are disabled in the engineering beta.',
    });
  }

  return Object.freeze({
    capabilityId,
    purpose,
    allowedInEngineeringBeta: true,
    reason:
      'Capability is non-side-effecting, available for read/planning use, and the requested product purpose is permitted.',
  });
}

export function assertTrumpCapabilityUseAllowed(
  capabilityId: string,
  purpose: TrumpEcosystemPurpose,
): TrumpCapabilityUseDecision {
  const decision = evaluateTrumpCapabilityUse(capabilityId, purpose);
  if (!decision.allowedInEngineeringBeta) {
    throw new Error(
      `${capabilityId} is blocked for ${purpose}: ${decision.reason}`,
    );
  }
  return decision;
}

export const OFFICIAL_TRUMP_ECOSYSTEM_POLICY = Object.freeze({
  type: 'skycoin4444.trump-ecosystem-policy.v1',
  scope: 'skycoin4444-engineering-beta',
  sourceReviewDate: '2026-09-23',
  externalAffiliationClaimed: false,
  issuerAuthorityClaimed: false,
  priceManipulationEnabled: false,
  politicalPersuasionEnabled: false,
  coordinatedInauthenticAmplificationEnabled: false,
  issuerImpersonationEnabled: false,
  liveSideEffectsEnabled: false,
  sourceCount: OFFICIAL_TRUMP_ECOSYSTEM_SOURCES.length,
} as const);
