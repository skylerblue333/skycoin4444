import { describe, expect, it } from 'vitest';
import {
  assertTrumpEcosystemPurposeAllowed,
  evaluateTrumpEcosystemPurpose,
  getOfficialTrumpEcosystemSource,
  OFFICIAL_TRUMP_ECOSYSTEM_POLICY,
  OFFICIAL_TRUMP_ECOSYSTEM_SOURCES,
} from './officialTrumpEcosystemPolicy';

describe('Official TRUMP ecosystem source and purpose policy', () => {
  it('publishes reviewed external sources without claiming ownership or affiliation', () => {
    expect(OFFICIAL_TRUMP_ECOSYSTEM_SOURCES).toHaveLength(6);
    expect(getOfficialTrumpEcosystemSource('official-site')?.url).toBe(
      'https://gettrumpmemes.com/',
    );
    expect(getOfficialTrumpEcosystemSource('market-update')?.external).toBe(true);

    for (const source of OFFICIAL_TRUMP_ECOSYSTEM_SOURCES) {
      expect(source.reviewedAt).toBe('2026-09-23');
      expect(source.url.startsWith('https://')).toBe(true);
    }

    expect(OFFICIAL_TRUMP_ECOSYSTEM_POLICY.externalAffiliationClaimed).toBe(false);
    expect(OFFICIAL_TRUMP_ECOSYSTEM_POLICY.issuerAuthorityClaimed).toBe(false);
  });

  it('allows neutral product purposes subject to the existing provider gates', () => {
    for (const purpose of [
      'asset_discovery',
      'portfolio_tracking',
      'wallet_safety',
      'market_information',
      'community_discussion',
      'creator_content',
      'commerce_handoff',
      'education',
      'developer_integration',
    ] as const) {
      expect(assertTrumpEcosystemPurposeAllowed(purpose).allowed).toBe(true);
    }
  });

  it('blocks price manipulation and coordinated inauthentic amplification', () => {
    for (const purpose of [
      'price_manipulation',
      'coordinated_inauthentic_amplification',
    ] as const) {
      expect(evaluateTrumpEcosystemPurpose(purpose).allowed).toBe(false);
      expect(() => assertTrumpEcosystemPurposeAllowed(purpose)).toThrow(/blocked/);
    }
    expect(OFFICIAL_TRUMP_ECOSYSTEM_POLICY.priceManipulationEnabled).toBe(false);
    expect(
      OFFICIAL_TRUMP_ECOSYSTEM_POLICY.coordinatedInauthenticAmplificationEnabled,
    ).toBe(false);
  });

  it('blocks political persuasion and issuer impersonation', () => {
    expect(evaluateTrumpEcosystemPurpose('political_persuasion')).toMatchObject({
      allowed: false,
    });
    expect(evaluateTrumpEcosystemPurpose('issuer_impersonation')).toMatchObject({
      allowed: false,
    });
    expect(OFFICIAL_TRUMP_ECOSYSTEM_POLICY.politicalPersuasionEnabled).toBe(false);
    expect(OFFICIAL_TRUMP_ECOSYSTEM_POLICY.issuerImpersonationEnabled).toBe(false);
  });

  it('keeps live external side effects disabled at the policy layer', () => {
    expect(OFFICIAL_TRUMP_ECOSYSTEM_POLICY.liveSideEffectsEnabled).toBe(false);
    expect(OFFICIAL_TRUMP_ECOSYSTEM_POLICY.sourceCount).toBe(6);
  });
});
