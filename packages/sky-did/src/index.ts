export type DidMethod = 'key' | 'web' | 'pkh';

export interface DidDocument {
  id: string;
  method: DidMethod;
  controller: string;
  alsoKnownAs: string[];
  verificationMethods: Array<{
    id: string;
    type: 'JsonWebKey2020';
    controller: string;
    publicKeyJwk: Readonly<Record<string, string>>;
  }>;
}

const DID_RE = /^did:([a-z0-9]+):([A-Za-z0-9._:%-]+)$/;

export function parseDid(input: string): { method: DidMethod; id: string } {
  const value = input.trim();
  if (value.length === 0 || value.length > 512) throw new Error('invalid DID length');
  const match = DID_RE.exec(value);
  if (!match) throw new Error('invalid DID syntax');
  const method = match[1] as DidMethod;
  if (!['key', 'web', 'pkh'].includes(method)) throw new Error('unsupported DID method');
  return { method, id: value };
}

export function normalizeAlsoKnownAs(values: readonly string[]): string[] {
  const normalized = values.map((value) => value.trim()).filter(Boolean);
  for (const value of normalized) {
    if (value.length > 512) throw new Error('alias too long');
    const url = new URL(value);
    if (url.protocol !== 'https:') throw new Error('aliases must use https');
  }
  return [...new Set(normalized)].sort();
}

export function createDidDocument(input: {
  did: string;
  controller?: string;
  alsoKnownAs?: readonly string[];
  publicKeyJwk: Readonly<Record<string, string>>;
}): DidDocument {
  const parsed = parseDid(input.did);
  const controller = input.controller ? parseDid(input.controller).id : parsed.id;
  const jwk = Object.fromEntries(
    Object.entries(input.publicKeyJwk)
      .filter(([key, value]) => key.trim() && typeof value === 'string' && value.length > 0)
      .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0),
  );
  if (!jwk.kty) throw new Error('publicKeyJwk.kty is required');

  return {
    id: parsed.id,
    method: parsed.method,
    controller,
    alsoKnownAs: normalizeAlsoKnownAs(input.alsoKnownAs ?? []),
    verificationMethods: [{
      id: `${parsed.id}#key-1`,
      type: 'JsonWebKey2020',
      controller,
      publicKeyJwk: jwk,
    }],
  };
}

export const SKY_DID_RESOLUTION_REQUEST_V1 = 'sky.did.resolve.request.v1' as const;
export const SKY_DID_RESOLUTION_RESULT_V1 = 'sky.did.resolve.result.v1' as const;

export interface DidResolutionRequestV1 {
  type: typeof SKY_DID_RESOLUTION_REQUEST_V1;
  did: string;
}

export interface DidResolutionResultV1 {
  type: typeof SKY_DID_RESOLUTION_RESULT_V1;
  did: string;
  document: DidDocument | null;
  resolutionPerformed: false;
  networkRequestPerformed: false;
}

export function planResolution(did: string): DidResolutionResultV1 {
  const parsed = parseDid(did);
  return {
    type: SKY_DID_RESOLUTION_RESULT_V1,
    did: parsed.id,
    document: null,
    resolutionPerformed: false,
    networkRequestPerformed: false,
  };
}
