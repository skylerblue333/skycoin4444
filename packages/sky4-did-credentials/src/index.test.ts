import { describe, expect, it } from 'vitest';
import { envelopeCredential, validateCredentialClaim } from './index';

const claim = {
  subjectDid: 'did:sky4:alice123',
  issuerDid: 'did:sky4:issuer456',
  type: 'profile',
  issuedAt: 100,
  expiresAt: 1000,
  attributes: { role: 'member', region: 'us' },
} as const;

describe('Sky4 DID credentials', () => {
  it('creates deterministic credential digests independent of attribute order', () => {
    const a = envelopeCredential(claim, 200).digest;
    const b = envelopeCredential({ ...claim, attributes: { region: 'us', role: 'member' } }, 200).digest;
    expect(a).toBe(b);
  });

  it('rejects expired credentials', () => {
    expect(() => validateCredentialClaim(claim, 1000)).toThrow('expired');
  });

  it('rejects credentials issued in the future', () => {
    expect(() => validateCredentialClaim({ ...claim, issuedAt: 300 }, 200)).toThrow('future');
  });

  it('rejects malformed DIDs', () => {
    expect(() => validateCredentialClaim({ ...claim, subjectDid: 'alice' }, 200)).toThrow('DID');
  });
});
