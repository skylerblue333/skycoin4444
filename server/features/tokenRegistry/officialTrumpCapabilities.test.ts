import { describe, expect, it } from 'vitest';
import {
  assertTrumpCapabilityNotLive,
  getOfficialTrumpCapability,
  listOfficialTrumpCapabilities,
  OFFICIAL_TRUMP_CAPABILITIES,
  OFFICIAL_TRUMP_CAPABILITY_COUNT,
  OFFICIAL_TRUMP_CAPABILITY_MANIFEST,
} from './officialTrumpCapabilities';

describe('Official TRUMP capability matrix', () => {
  it('publishes exactly 120 unique capability records across 12 categories', () => {
    expect(OFFICIAL_TRUMP_CAPABILITY_COUNT).toBe(120);
    expect(new Set(OFFICIAL_TRUMP_CAPABILITIES.map(item => item.id)).size).toBe(120);
    expect(new Set(OFFICIAL_TRUMP_CAPABILITIES.map(item => item.category)).size).toBe(12);

    for (const category of new Set(OFFICIAL_TRUMP_CAPABILITIES.map(item => item.category))) {
      expect(listOfficialTrumpCapabilities(category)).toHaveLength(10);
    }
  });

  it('keeps implemented metadata and validation contracts truthfully available', () => {
    expect(getOfficialTrumpCapability('asset-designation')).toMatchObject({
      maturity: 'implemented_contract',
      availability: 'available_read_only',
      sideEffecting: false,
    });
    expect(getOfficialTrumpCapability('unsigned-transfer-intent')).toMatchObject({
      maturity: 'implemented_contract',
      availability: 'available_planning_only',
      sideEffecting: false,
    });
    expect(getOfficialTrumpCapability('spl-u64-limit')?.maturity).toBe(
      'implemented_contract',
    );
  });

  it('gates custody, broadcasting, settlement, and automated trading', () => {
    for (const id of ['custody', 'live-broadcast', 'settlement', 'automated-trading']) {
      expect(getOfficialTrumpCapability(id)).toMatchObject({
        availability: 'gated',
        sideEffecting: true,
      });
      expect(() => assertTrumpCapabilityNotLive(id)).toThrow(/not live-enabled/);
    }
  });

  it('treats legal-tender status and regulatory approval as external authority only', () => {
    for (const id of ['legal-tender-status', 'regulatory-approval', 'issuer-partnership']) {
      expect(getOfficialTrumpCapability(id)).toMatchObject({
        maturity: 'authority_required',
        availability: 'external_only',
      });
      expect(() => assertTrumpCapabilityNotLive(id)).toThrow(/not live-enabled/);
    }
  });

  it('never upgrades roadmap entries into live claims through the manifest', () => {
    expect(OFFICIAL_TRUMP_CAPABILITY_MANIFEST).toMatchObject({
      capabilityCount: 120,
      liveSideEffectsEnabled: false,
      legalTenderClaimed: false,
      regulatoryApprovalClaimed: false,
      externalAffiliationClaimed: false,
      custodyClaimed: false,
      settlementClaimed: false,
      automatedTradingClaimed: false,
    });
  });

  it('allows non-side-effecting implemented/read-only contracts through the guard', () => {
    expect(assertTrumpCapabilityNotLive('asset-designation').id).toBe(
      'asset-designation',
    );
    expect(assertTrumpCapabilityNotLive('solana-mint').id).toBe('solana-mint');
  });
});
