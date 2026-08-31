import { describe, expect, it } from 'vitest';
import { evaluateQuorum } from './index';

const HASH = 'a'.repeat(64);
const validators = [
  { id: 'validator:a', votingPower: 40n },
  { id: 'validator:b', votingPower: 35n },
  { id: 'validator:c', votingPower: 25n },
] as const;

describe('Sky4 consensus engine', () => {
  it('reaches quorum at two-thirds voting power', () => {
    const result = evaluateQuorum({
      validators,
      height: 7n,
      blockHash: HASH,
      votes: [
        { validatorId: 'validator:a', height: 7n, blockHash: HASH },
        { validatorId: 'validator:b', height: 7n, blockHash: HASH },
      ],
    });
    expect(result.signedPower).toBe(75n);
    expect(result.totalPower).toBe(100n);
    expect(result.quorumReached).toBe(true);
  });

  it('does not count votes for another block', () => {
    const result = evaluateQuorum({
      validators,
      height: 7n,
      blockHash: HASH,
      votes: [
        { validatorId: 'validator:a', height: 7n, blockHash: 'b'.repeat(64) },
        { validatorId: 'validator:b', height: 7n, blockHash: HASH },
      ],
    });
    expect(result.signedPower).toBe(35n);
    expect(result.quorumReached).toBe(false);
  });

  it('rejects duplicate votes, including conflicting-block equivocation', () => {
    const vote = { validatorId: 'validator:a', height: 7n, blockHash: HASH } as const;
    expect(() => evaluateQuorum({ validators, height: 7n, blockHash: HASH, votes: [vote, vote] }))
      .toThrow('duplicate validator vote');

    expect(() => evaluateQuorum({
      validators,
      height: 7n,
      blockHash: HASH,
      votes: [
        { validatorId: 'validator:a', height: 7n, blockHash: 'b'.repeat(64) },
        vote,
      ],
    })).toThrow('duplicate validator vote');
  });

  it('rejects unknown validators even when they vote for another block', () => {
    expect(() => evaluateQuorum({
      validators,
      height: 7n,
      blockHash: HASH,
      votes: [{ validatorId: 'validator:z', height: 7n, blockHash: 'b'.repeat(64) }],
    })).toThrow('unknown validator');
  });

  it('rejects malformed runtime bigint values from untyped callers', () => {
    expect(() => evaluateQuorum({
      validators: [{ id: 'validator:a', votingPower: 40 as never }],
      height: 7n,
      blockHash: HASH,
      votes: [],
    })).toThrow('positive bigint');

    expect(() => evaluateQuorum({
      validators,
      height: 7 as never,
      blockHash: HASH,
      votes: [],
    })).toThrow('non-negative bigint');
  });

  it('produces deterministic result digests', () => {
    const input = {
      validators,
      height: 8n,
      blockHash: HASH,
      votes: [{ validatorId: 'validator:a', height: 8n, blockHash: HASH }],
    } as const;
    expect(evaluateQuorum(input).digest).toBe(evaluateQuorum(input).digest);
  });
});
