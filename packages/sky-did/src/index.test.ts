import { describe, expect, it } from 'vitest';
import { createDidDocument, normalizeAlsoKnownAs, parseDid, planResolution } from './index.js';

describe('SkyDID', () => {
  it('parses supported DIDs and rejects unsupported methods', () => {
    expect(parseDid('did:web:example.com')).toEqual({ method: 'web', id: 'did:web:example.com' });
    expect(() => parseDid('did:ion:abc')).toThrow('unsupported DID method');
  });

  it('normalizes HTTPS aliases deterministically', () => {
    expect(normalizeAlsoKnownAs(['https://b.example', ' https://a.example ', 'https://b.example'])).toEqual([
      'https://a.example',
      'https://b.example',
    ]);
    expect(() => normalizeAlsoKnownAs(['http://example.com'])).toThrow('aliases must use https');
  });

  it('builds a deterministic bounded DID document', () => {
    const document = createDidDocument({
      did: 'did:key:z6Mktest',
      publicKeyJwk: { x: 'abc', kty: 'OKP', crv: 'Ed25519' },
      alsoKnownAs: ['https://example.com/profile'],
    });
    expect(document.id).toBe('did:key:z6Mktest');
    expect(Object.keys(document.verificationMethods[0].publicKeyJwk)).toEqual(['crv', 'kty', 'x']);
  });

  it('makes resolution boundaries explicit', () => {
    expect(planResolution('did:pkh:eip155%3A1%3A0xabc')).toEqual({
      type: 'sky.did.resolve.result.v1',
      did: 'did:pkh:eip155%3A1%3A0xabc',
      document: null,
      resolutionPerformed: false,
      networkRequestPerformed: false,
    });
  });
});
