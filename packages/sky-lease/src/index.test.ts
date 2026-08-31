import { describe, expect, it } from 'vitest';
import { acquireLease, isLeaseActive, renewLease } from './index';

describe('SkyLease', () => {
  it('acquires and renews an active lease for the same holder', () => {
    const lease = acquireLease('resource:alpha', 'worker:one', 100, 50);
    expect(isLeaseActive(lease, 120)).toBe(true);
    expect(renewLease(lease, 'worker:one', 120, 100).expiresAt).toBe(220);
  });
  it('rejects takeover before expiry and permits new generation after expiry', () => {
    const lease = acquireLease('resource:alpha', 'worker:one', 100, 50);
    expect(() => acquireLease('resource:alpha', 'worker:two', 149, 50, lease)).toThrow('already active');
    expect(acquireLease('resource:alpha', 'worker:two', 150, 50, lease).generation).toBe(2);
  });
  it('rejects wrong-holder and expired renewal', () => {
    const lease = acquireLease('resource:alpha', 'worker:one', 100, 50);
    expect(() => renewLease(lease, 'worker:two', 120, 50)).toThrow('holder mismatch');
    expect(() => renewLease(lease, 'worker:one', 150, 50)).toThrow('not renewable');
  });
});
