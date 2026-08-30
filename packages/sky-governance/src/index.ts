export type ProposalStatus = 'draft' | 'open' | 'closed' | 'cancelled';
export type VoteChoice = 'for' | 'against' | 'abstain';
export type Proposal = Readonly<{ id: string; title: string; status: ProposalStatus; version: number; votes: Readonly<Record<VoteChoice, number>>; voters: readonly string[] }>;

export const GOVERNANCE_DECISION_EVENT = 'sky.governance.decision.v1' as const;

const clean = (value: string, field: string) => {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
};

export function createProposal(id: string, title: string): Proposal {
  return Object.freeze({ id: clean(id, 'id'), title: clean(title, 'title'), status: 'draft', version: 1, votes: Object.freeze({ for: 0, against: 0, abstain: 0 }), voters: Object.freeze([]) });
}

export function openProposal(proposal: Proposal): Proposal {
  if (proposal.status !== 'draft') throw new Error('only draft proposals can open');
  return Object.freeze({ ...proposal, status: 'open', version: proposal.version + 1 });
}

export function castVote(proposal: Proposal, voterId: string, choice: VoteChoice): Proposal {
  if (proposal.status !== 'open') throw new Error('proposal is not open');
  const voter = clean(voterId, 'voterId');
  if (proposal.voters.includes(voter)) throw new Error('duplicate voter');
  return Object.freeze({ ...proposal, version: proposal.version + 1, votes: Object.freeze({ ...proposal.votes, [choice]: proposal.votes[choice] + 1 }), voters: Object.freeze([...proposal.voters, voter]) });
}

export function closeProposal(proposal: Proposal): Proposal {
  if (proposal.status !== 'open') throw new Error('only open proposals can close');
  return Object.freeze({ ...proposal, status: 'closed', version: proposal.version + 1 });
}

export function cancelProposal(proposal: Proposal): Proposal {
  if (proposal.status === 'closed') throw new Error('closed proposals cannot be cancelled');
  if (proposal.status === 'cancelled') return proposal;
  return Object.freeze({ ...proposal, status: 'cancelled', version: proposal.version + 1 });
}

export function outcome(proposal: Proposal): VoteChoice | 'tie' {
  if (proposal.status !== 'closed') throw new Error('proposal is not closed');
  const entries = Object.entries(proposal.votes) as [VoteChoice, number][];
  const max = Math.max(...entries.map(([, count]) => count));
  const winners = entries.filter(([, count]) => count === max).map(([choice]) => choice);
  return winners.length === 1 ? winners[0] : 'tie';
}
