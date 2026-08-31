import { describe, expect, it } from 'vitest';
import { createReleaseManifest } from './index';

const A = 'a'.repeat(40);
const B = 'b'.repeat(40);

const component = (id: string, revision = A, dependencies: string[] = []) => ({
  id,
  version: '1.0.0',
  revision,
  stage: 'engineering-beta' as const,
  dependencies,
});

describe('SkyReleaseManifest', () => {
  it('is deterministic across input and dependency ordering', () => {
    const first = createReleaseManifest([
      component('api', B, ['core']),
      component('core'),
    ]);
    const second = createReleaseManifest([
      component('core'),
      component('api', B, ['core']),
    ]);
    expect(first.digest).toBe(second.digest);
    expect(first.components.map((entry) => entry.id)).toEqual(['api', 'core']);
  });

  it('rejects duplicate and unknown dependencies', () => {
    expect(() => createReleaseManifest([component('core'), component('core', B)])).toThrow('duplicate component id');
    expect(() => createReleaseManifest([component('api', A, ['missing'])])).toThrow('unknown dependency');
  });

  it('rejects cycles and self-dependencies', () => {
    expect(() => createReleaseManifest([component('core', A, ['core'])])).toThrow('self dependency');
    expect(() => createReleaseManifest([
      component('api', A, ['core']),
      component('core', B, ['api']),
    ])).toThrow('dependency cycle');
  });

  it('rejects malformed immutable revisions and versions', () => {
    expect(() => createReleaseManifest([{ ...component('core'), revision: 'main' }])).toThrow('invalid immutable revision');
    expect(() => createReleaseManifest([{ ...component('core'), version: 'latest' }])).toThrow('invalid component version');
  });
});
