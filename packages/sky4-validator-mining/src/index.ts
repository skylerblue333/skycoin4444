import { createHash } from 'node:crypto';

export type ValidatorCandidate = Readonly<{
  validatorId: string;
  stake: bigint;
  uptimeBps: number;
  penaltyPoints: number;
}>;

export type SelectionResult = Readonly<{
  selectedValidatorId: string;
  effectiveWeights: ReadonlyMap<string, bigint>;
  seedDigest: string;
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{3,128}$/;

export function effectiveWeight(candidate: ValidatorCandidate): bigint {
  if (!ID_RE.test(candidate.validatorId)) throw new Error('invalid validator id');
  if (candidate.stake <= 0n) throw new Error('stake must be positive');
  if (!Number.isInteger(candidate.uptimeBps) || candidate.uptimeBps < 0 || candidate.uptimeBps > 10_000) throw new Error('uptimeBps must be 0-10000');
  if (!Number.isInteger(candidate.penaltyPoints) || candidate.penaltyPoints < 0 || candidate.penaltyPoints > 10_000) throw new Error('penaltyPoints must be 0-10000');
  const availability = (candidate.stake * BigInt(candidate.uptimeBps)) / 10_000n;
  const penalty = (availability * BigInt(candidate.penaltyPoints)) / 10_000n;
  return availability - penalty;
}

export function selectValidator(input: {
  candidates: readonly ValidatorCandidate[];
  seed: string;
}): SelectionResult {
  if (input.candidates.length === 0 || input.candidates.length > 10_000) throw new Error('candidate count must be 1-10000');
  if (input.seed.length < 8 || input.seed.length > 256) throw new Error('seed length must be 8-256');
  const weights = new Map<string, bigint>();
  let total = 0n;
  for (const candidate of input.candidates) {
    if (weights.has(candidate.validatorId)) throw new Error('duplicate validator id');
    const weight = effectiveWeight(candidate);
    if (weight <= 0n) throw new Error('candidate effective weight must be positive');
    weights.set(candidate.validatorId, weight);
    total += weight;
  }
  const digest = createHash('sha256').update(input.seed, 'utf8').digest('hex');
  const pick = BigInt(`0x${digest}`) % total;
  let cursor = 0n;
  for (const [validatorId, weight] of [...weights].sort(([a], [b]) => a.localeCompare(b))) {
    cursor += weight;
    if (pick < cursor) return Object.freeze({ selectedValidatorId: validatorId, effectiveWeights: weights, seedDigest: digest });
  }
  throw new Error('selection failed');
}
