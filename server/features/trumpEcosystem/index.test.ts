import { describe, expect, it } from 'vitest';
import {
  assertTrumpCapabilityMayRunLocally,
  createTrumpEcosystemSnapshot,
  getTrumpEcosystemCapability,
  listTrumpEcosystemCapabilities,
  summarizeTrumpEcosystemReadiness,
  TRUMP_ECOSYSTEM_CAPABILITIES,
  TRUMP_ECOSYSTEM_SOURCES,
} from './index';

describe('TRUMP ecosystem readiness control plane', () => {
  it('defines exactly 100 unique productization capabilities', () => {
    expect(TRUMP_ECOSYSTEM_CAPABILITIES).toHaveLength(100);
    expect(
      new Set(TRUMP_ECOSYSTEM_CAPABILITIES.map(item => item.id)).size,
    ).toBe(100);
  });

  it('keeps provider-backed work explicit instead of pretending it is live', () => {
    const providerRequired = listTrumpEcosystemCapabilities('provider_required');
    expect(providerRequired.length).toBeGreaterThan(0);
    for (const item of providerRequired) {
      expect(item.provider).toBeTruthy();
    }
  });

  it('never marks an external side effect as locally runnable', () => {
    const risky = TRUMP_ECOSYSTEM_CAPABILITIES.filter(
      item => item.externalSideEffect,
    );
    expect(risky.length).toBeGreaterThan(0);
    for (const item of risky) {
      expect(item.disposition).not.toBe('local_candidate');
    }
  });

  it('blocks manipulation, political persuasion, custody, and autonomous trading', () => {
    for (const id of [
      'price-manipulation-campaigns',
      'political-persuasion-campaigns',
      'political-microtargeting',
      'coordinated-hype-bots',
      'custodial-key-storage',
      'automated-token-trading',
      'signed-transfer-broadcast',
    ]) {
      expect(getTrumpEcosystemCapability(id)?.disposition).toBe('blocked_beta');
    }
  });

  it('permits deterministic local product candidates but fails closed otherwise', () => {
    expect(assertTrumpCapabilityMayRunLocally('asset-identity-card').id).toBe(
      'asset-identity-card',
    );
    expect(() =>
      assertTrumpCapabilityMayRunLocally('spot-price'),
    ).toThrow(/not approved for local execution/);
    expect(() =>
      assertTrumpCapabilityMayRunLocally('automated-token-trading'),
    ).toThrow(/not approved for local execution/);
    expect(() =>
      assertTrumpCapabilityMayRunLocally('missing-capability'),
    ).toThrow(/unknown/);
  });

  it('publishes a source directory and explicit truth boundaries', () => {
    expect(TRUMP_ECOSYSTEM_SOURCES.length).toBeGreaterThanOrEqual(5);
    expect(
      TRUMP_ECOSYSTEM_SOURCES.some(source =>
        source.url.startsWith('https://gettrumpmemes.com/'),
      ),
    ).toBe(true);

    const snapshot = createTrumpEcosystemSnapshot();
    expect(snapshot.reviewedAt).toBe('2026-09-23');
    expect(snapshot.externalAffiliationClaimed).toBe(false);
    expect(snapshot.priceManipulationEnabled).toBe(false);
    expect(snapshot.politicalPersuasionEnabled).toBe(false);
    expect(snapshot.custodyEnabled).toBe(false);
    expect(snapshot.automatedTradingEnabled).toBe(false);
  });

  it('summarizes every capability without dropping a disposition', () => {
    const summary = summarizeTrumpEcosystemReadiness();
    expect(summary.totalCapabilities).toBe(100);
    expect(
      Object.values(summary.byDisposition).reduce((sum, count) => sum + count, 0),
    ).toBe(100);
    expect(summary.providerRequired).toBeGreaterThan(0);
    expect(summary.blockedBeta).toBeGreaterThan(0);
  });
});
