import { describe, expect, it } from 'vitest';
import { evaluateCompatibility } from './index';

describe('SkyCapabilityCompat', () => {
  it('accepts compatible bounded versions', () => {
    expect(evaluateCompatibility([{ name: 'events.api', version: 3 }], [{ name: 'events.api', minVersion: 2, maxVersion: 4 }])).toEqual({ compatible: true, missing: [], incompatible: [] });
  });
  it('reports missing and incompatible capabilities deterministically', () => {
    const result = evaluateCompatibility([{ name: 'events.api', version: 1 }], [
      { name: 'wallet.api', minVersion: 1 },
      { name: 'events.api', minVersion: 2 },
    ]);
    expect(result).toEqual({ compatible: false, missing: ['wallet.api'], incompatible: ['events.api'] });
  });
  it('rejects duplicate and invalid requirement ranges', () => {
    expect(() => evaluateCompatibility([{ name: 'events.api', version: 1 }, { name: 'events.api', version: 2 }], [])).toThrow('duplicate provided');
    expect(() => evaluateCompatibility([], [{ name: 'events.api', minVersion: 3, maxVersion: 2 }])).toThrow('invalid requirement range');
  });
});
