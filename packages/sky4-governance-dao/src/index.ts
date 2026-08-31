export type Proposal = Readonly<{
  id: string;
  title: string;
  startsAt: number;
  endsAt: number;
  quorumBps: number;
}>;

export type Ballot = Readonly<{
  voterId: string;
  proposalId: string;
  support: boolean;
  votingPower: bigint;
}>;

export type Tally = Readonly<{
  yes: bigint;
  no: bigint;
  participation: bigint;
  quorumReached: boolean;
  passed: boolean;
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{3,128}$/;

export function tallyProposal(input: {
  proposal: Proposal;
  ballots: readonly Ballot[];
  eligibleVotingPower: bigint;
  now: number;
}): Tally {
  const { proposal } = input;
  if (!ID_RE.test(proposal.id)) throw new Error('invalid proposal id');
  if (proposal.title.trim().length < 3 || proposal.title.length > 200) throw new Error('invalid proposal title');
  if (!Number.isSafeInteger(proposal.startsAt) || !Number.isSafeInteger(proposal.endsAt) || proposal.startsAt >= proposal.endsAt) {
    throw new Error('invalid proposal window');
  }
  if (!Number.isInteger(proposal.quorumBps) || proposal.quorumBps < 0 || proposal.quorumBps > 10_000) throw new Error('invalid quorumBps');
  if (!Number.isSafeInteger(input.now)) throw new Error('invalid now');
  if (typeof input.eligibleVotingPower !== 'bigint' || input.eligibleVotingPower <= 0n) {
    throw new Error('eligibleVotingPower must be a positive bigint');
  }
  if (input.ballots.length > 100_000) throw new Error('ballot limit exceeded');

  const seen = new Set<string>();
  let yes = 0n;
  let no = 0n;
  for (const ballot of input.ballots) {
    if (ballot.proposalId !== proposal.id) throw new Error('ballot proposal mismatch');
    if (!ID_RE.test(ballot.voterId)) throw new Error('invalid voter id');
    if (typeof ballot.support !== 'boolean') throw new Error('ballot support must be boolean');
    if (typeof ballot.votingPower !== 'bigint' || ballot.votingPower <= 0n) {
      throw new Error('voting power must be a positive bigint');
    }
    if (seen.has(ballot.voterId)) throw new Error('duplicate voter ballot');
    seen.add(ballot.voterId);
    if (ballot.support) yes += ballot.votingPower;
    else no += ballot.votingPower;
  }
  const participation = yes + no;
  if (participation > input.eligibleVotingPower) throw new Error('participation exceeds eligible voting power');
  const quorumReached = participation * 10_000n >= input.eligibleVotingPower * BigInt(proposal.quorumBps);
  const passed = input.now >= proposal.endsAt && quorumReached && yes > no;
  return Object.freeze({ yes, no, participation, quorumReached, passed });
}
