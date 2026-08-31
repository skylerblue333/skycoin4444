import { createHash } from 'node:crypto';

export type Validator = Readonly<{
  id: string;
  votingPower: bigint;
}>;

export type Vote = Readonly<{
  validatorId: string;
  height: bigint;
  blockHash: string;
}>;

export type QuorumResult = Readonly<{
  blockHash: string;
  signedPower: bigint;
  totalPower: bigint;
  quorumReached: boolean;
  digest: string;
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{3,128}$/;
const HASH_RE = /^[a-f0-9]{64}$/;
const MAX_VALIDATORS = 10_000;
const MAX_VOTES = 10_000;

export function validateValidator(validator: Validator): void {
  if (!ID_RE.test(validator.id)) throw new Error('validator id must be 3-128 safe characters');
  if (typeof validator.votingPower !== 'bigint' || validator.votingPower <= 0n) {
    throw new Error('voting power must be a positive bigint');
  }
}

export function validateVote(vote: Vote): void {
  if (!ID_RE.test(vote.validatorId)) throw new Error('validator id must be 3-128 safe characters');
  if (typeof vote.height !== 'bigint' || vote.height < 0n) {
    throw new Error('height must be a non-negative bigint');
  }
  if (!HASH_RE.test(vote.blockHash)) throw new Error('blockHash must be a lowercase sha256 digest');
}

export function evaluateQuorum(input: {
  validators: readonly Validator[];
  votes: readonly Vote[];
  height: bigint;
  blockHash: string;
}): QuorumResult {
  if (input.validators.length === 0) throw new Error('validator set must not be empty');
  if (input.validators.length > MAX_VALIDATORS) throw new Error('validator set limit exceeded');
  if (input.votes.length > MAX_VOTES) throw new Error('vote set limit exceeded');
  if (typeof input.height !== 'bigint' || input.height < 0n) {
    throw new Error('height must be a non-negative bigint');
  }
  if (!HASH_RE.test(input.blockHash)) throw new Error('blockHash must be a lowercase sha256 digest');

  const powers = new Map<string, bigint>();
  let totalPower = 0n;
  for (const validator of input.validators) {
    validateValidator(validator);
    if (powers.has(validator.id)) throw new Error('duplicate validator id');
    powers.set(validator.id, validator.votingPower);
    totalPower += validator.votingPower;
  }

  const seen = new Set<string>();
  let signedPower = 0n;
  for (const vote of input.votes) {
    validateVote(vote);
    if (vote.height !== input.height) throw new Error('vote height mismatch');
    if (seen.has(vote.validatorId)) throw new Error('duplicate validator vote');
    seen.add(vote.validatorId);
    const power = powers.get(vote.validatorId);
    if (power === undefined) throw new Error('vote from unknown validator');
    if (vote.blockHash !== input.blockHash) continue;
    signedPower += power;
  }

  const quorumReached = signedPower * 3n >= totalPower * 2n;
  const canonical = [input.height, input.blockHash, totalPower, signedPower, quorumReached ? 1 : 0].join('\n');
  const digest = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return Object.freeze({ blockHash: input.blockHash, signedPower, totalPower, quorumReached, digest });
}
