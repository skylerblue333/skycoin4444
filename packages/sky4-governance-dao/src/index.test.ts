import { describe, expect, it } from 'vitest';
import { tallyProposal } from './index';

const proposal = {
  id: 'proposal:1',
  title: 'Enable community grants',
  startsAt: 100,
  endsAt: 200,
  quorumBps: 5000,
} as const;

describe('Sky4 governance DAO', () => {
  it('passes only after close with quorum and majority', () => {
    const tally = tallyProposal({
      proposal,
      eligibleVotingPower: 100n,
      now: 201,
      ballots: [
        { voterId: 'voter:alice', proposalId: proposal.id, support: true, votingPower: 40n },
        { voterId: 'voter:bob', proposalId: proposal.id, support: false, votingPower: 15n },
      ],
    });
    expect(tally.quorumReached).toBe(true);
    expect(tally.passed).toBe(true);
  });

  it('does not finalize before the proposal closes', () => {
    const tally = tallyProposal({
      proposal,
      eligibleVotingPower: 10n,
      now: 150,
      ballots: [{ voterId: 'voter:alice', proposalId: proposal.id, support: true, votingPower: 10n }],
    });
    expect(tally.passed).toBe(false);
  });

  it('rejects duplicate voters', () => {
    const ballot = { voterId: 'voter:alice', proposalId: proposal.id, support: true, votingPower: 1n } as const;
    expect(() => tallyProposal({ proposal, eligibleVotingPower: 10n, now: 201, ballots: [ballot, ballot] }))
      .toThrow('duplicate voter');
  });

  it('rejects impossible participation totals', () => {
    expect(() => tallyProposal({
      proposal,
      eligibleVotingPower: 10n,
      now: 201,
      ballots: [{ voterId: 'voter:alice', proposalId: proposal.id, support: true, votingPower: 11n }],
    })).toThrow('participation exceeds');
  });
});
