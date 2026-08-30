import { describe, expect, it } from 'vitest';
import { createHealthEnvelope, summarizeHealth } from './index.js';

describe('SkyHealth', () => {
  it('returns worst status with deterministic signal ordering', () => {
    const summary = summarizeHealth([
      { name: 'database', status: 'degraded', checkedAt: '2026-08-30T20:00:00Z' },
      { name: 'api', status: 'healthy', checkedAt: '2026-08-30T20:01:00Z' },
    ]);
    expect(summary.status).toBe('degraded');
    expect(summary.checkedAt).toBe('2026-08-30T20:01:00.000Z');
    expect(summary.signals.map((signal) => signal.name)).toEqual(['api', 'database']);
  });

  it('rejects invalid timestamps and empty signal sets', () => {
    expect(() => summarizeHealth([])).toThrow('at least one signal is required');
    expect(() => summarizeHealth([{ name: 'api', status: 'healthy', checkedAt: 'not-a-date' }])).toThrow('invalid checkedAt');
  });

  it('keeps monitoring and delivery claims explicitly false', () => {
    const envelope = createHealthEnvelope([{ name: 'api', status: 'healthy', checkedAt: '2026-08-30T20:01:00Z' }]);
    expect(envelope.type).toBe('sky.health.summary.v1');
    expect(envelope.monitoringPerformed).toBe(false);
    expect(envelope.alertDeliveryPerformed).toBe(false);
  });
});
