import { describe, expect, it } from 'vitest';
import { cancelProposal, castVote, closeProposal, createProposal, openProposal, outcome } from './index';

describe('SkyGovernance', () => {
  it('creates normalized drafts and opens deterministically', () => {
    expect(openProposal(createProposal(' p1 ', ' Upgrade '))).toMatchObject({ id: 'p1', title: 'Upgrade', status: 'open', version: 2 });
  });

  it('records one vote per normalized voter', () => {
    const open = openProposal(createProposal('p1', 'Upgrade'));
    const voted = castVote(open, ' u1 ', 'for');
    expect(voted.votes.for).toBe(1);
    expect(() => castVote(voted, 'u1', 'against')).toThrow('duplicate voter');
  });

  it('closes and computes deterministic outcomes', () => {
    let proposal = openProposal(createProposal('p1', 'Upgrade'));
    proposal = castVote(proposal, 'u1', 'for');
    proposal = castVote(proposal, 'u2', 'against');
    expect(outcome(closeProposal(proposal))).toBe('tie');
  });

  it('enforces terminal cancellation boundaries', () => {
    const cancelled = cancelProposal(createProposal('p1', 'Upgrade'));
    expect(cancelProposal(cancelled)).toBe(cancelled);
    const closed = closeProposal(openProposal(createProposal('p2', 'Ship')));
    expect(() => cancelProposal(closed)).toThrow('closed proposals cannot be cancelled');
  });
});
