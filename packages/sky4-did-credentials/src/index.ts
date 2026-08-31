import { createHash } from 'node:crypto';

export type CredentialClaim = Readonly<{
  subjectDid: string;
  issuerDid: string;
  type: string;
  issuedAt: number;
  expiresAt?: number;
  attributes: Readonly<Record<string, string>>;
}>;

export type CredentialEnvelope = Readonly<{
  claim: CredentialClaim;
  digest: string;
}>;

const DID_RE = /^did:[a-z0-9]+:[a-zA-Z0-9._:%-]{3,180}$/;
const TYPE_RE = /^[a-zA-Z0-9:_-]{2,80}$/;
const ATTR_RE = /^[a-zA-Z0-9:_-]{1,80}$/;

export function validateCredentialClaim(claim: CredentialClaim, now: number): void {
  if (!DID_RE.test(claim.subjectDid) || !DID_RE.test(claim.issuerDid)) throw new Error('invalid DID');
  if (!TYPE_RE.test(claim.type)) throw new Error('invalid credential type');
  if (!Number.isSafeInteger(claim.issuedAt) || claim.issuedAt < 0) throw new Error('invalid issuedAt');
  if (!Number.isSafeInteger(now) || now < 0) throw new Error('invalid now');
  if (claim.issuedAt > now) throw new Error('credential issued in the future');
  if (claim.expiresAt !== undefined) {
    if (!Number.isSafeInteger(claim.expiresAt) || claim.expiresAt <= claim.issuedAt) throw new Error('invalid expiresAt');
    if (now >= claim.expiresAt) throw new Error('credential expired');
  }
  const entries = Object.entries(claim.attributes);
  if (entries.length > 100) throw new Error('attribute limit exceeded');
  for (const [key, value] of entries) {
    if (!ATTR_RE.test(key)) throw new Error('invalid attribute key');
    if (value.length > 1024) throw new Error('attribute value limit exceeded');
  }
}

export function envelopeCredential(claim: CredentialClaim, now: number): CredentialEnvelope {
  validateCredentialClaim(claim, now);
  const attributes = Object.entries(claim.attributes).sort(([a], [b]) => a.localeCompare(b));
  const canonical = JSON.stringify({
    subjectDid: claim.subjectDid,
    issuerDid: claim.issuerDid,
    type: claim.type,
    issuedAt: claim.issuedAt,
    expiresAt: claim.expiresAt ?? null,
    attributes,
  });
  const digest = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return Object.freeze({ claim: Object.freeze({ ...claim, attributes: Object.freeze({ ...claim.attributes }) }), digest });
}
