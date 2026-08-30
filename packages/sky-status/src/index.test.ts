import { describe, expect, it } from 'vitest';
import { createStatusSnapshot } from './index.js';

describe('SkyStatus', () => {
  it('computes deterministic overall state from components', () => {
    const snapshot = createStatusSnapshot([
      { id: 'api', name: ' API ', state: 'operational' },
      { id: 'search', name: 'Search', state: 'degraded', message: ' Elevated   latency ' },
    ], '2026-08-30T21:00:00Z');
    expect(snapshot.overall).toBe('degraded');
    expect(snapshot.components[1]?.message).toBe('Elevated latency');
    expect(snapshot.type).toBe('sky.status.snapshot.v1');
  });

  it('treats outage as most severe', () => {
    const snapshot = createStatusSnapshot([
      { id: 'a', name: 'A', state: 'maintenance' },
      { id: 'b', name: 'B', state: 'outage' },
      { id: 'c', name: 'C', state: 'degraded' },
    ], '2026-08-30T21:00:00.123Z');
    expect(snapshot.overall).toBe('outage');
  });

  it('rejects duplicate components and impossible timestamps', () => {
    expect(() => createStatusSnapshot([
      { id: 'api', name: 'API', state: 'operational' },
      { id: 'api', name: 'API copy', state: 'degraded' },
    ], '2026-08-30T21:00:00Z')).toThrow(/duplicate/);
    expect(() => createStatusSnapshot([
      { id: 'api', name: 'API', state: 'operational' },
    ], '2026-02-31T21:00:00Z')).toThrow();
  });
});
