import { describe, expect, it } from 'vitest';
import { createArtifactCatalog, findArtifact } from './index';

const A = 'a'.repeat(64);
const B = 'b'.repeat(64);

describe('SkyArtifactCatalog', () => {
  it('canonicalizes artifact ordering deterministically', () => {
    const first = createArtifactCatalog([
      { name: 'web', version: '1.0.0', sha256: B, sizeBytes: 20, mediaType: 'application/zip' },
      { name: 'api', version: '1.0.0', sha256: A, sizeBytes: 10, mediaType: 'application/zip' },
    ]);
    const second = createArtifactCatalog([...first.artifacts].reverse());
    expect(first.digest).toBe(second.digest);
    expect(first.artifacts.map((item) => item.name)).toEqual(['api', 'web']);
  });
  it('finds exact artifact versions', () => {
    const catalog = createArtifactCatalog([{ name: 'api', version: '1.2.3', sha256: A, sizeBytes: 10, mediaType: 'application/zip' }]);
    expect(findArtifact(catalog, 'api', '1.2.3')?.sha256).toBe(A);
  });
  it('rejects duplicates and malformed integrity data', () => {
    const artifact = { name: 'api', version: '1.0.0', sha256: A, sizeBytes: 10, mediaType: 'application/zip' };
    expect(() => createArtifactCatalog([artifact, artifact])).toThrow('duplicate artifact');
    expect(() => createArtifactCatalog([{ ...artifact, sha256: 'bad' }])).toThrow('invalid artifact sha256');
  });
});
