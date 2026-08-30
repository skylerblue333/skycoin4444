export type ReactionKind = 'like' | 'love' | 'insightful' | 'celebrate' | 'support';

export type Reaction = Readonly<{
  subjectId: string;
  actorId: string;
  kind: ReactionKind;
}>;

export type ReactionSummary = Readonly<{
  subjectId: string;
  total: number;
  byKind: Readonly<Record<ReactionKind, number>>;
}>;

const REACTION_KINDS: readonly ReactionKind[] = ['like', 'love', 'insightful', 'celebrate', 'support'];

function clean(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

export function createReaction(input: Reaction): Reaction {
  if (!REACTION_KINDS.includes(input.kind)) throw new Error('unsupported reaction kind');
  return Object.freeze({ subjectId: clean(input.subjectId, 'subjectId'), actorId: clean(input.actorId, 'actorId'), kind: input.kind });
}

export function reactionKey(reaction: Reaction): string {
  return `${reaction.subjectId}\u0000${reaction.actorId}`;
}

export function upsertReaction(reactions: readonly Reaction[], input: Reaction): readonly Reaction[] {
  const next = createReaction(input);
  const key = reactionKey(next);
  const retained = reactions.filter((reaction) => reactionKey(reaction) !== key);
  return Object.freeze([...retained, next].sort((a, b) => reactionKey(a) < reactionKey(b) ? -1 : reactionKey(a) > reactionKey(b) ? 1 : 0));
}

export function removeReaction(reactions: readonly Reaction[], subjectId: string, actorId: string): readonly Reaction[] {
  const key = `${clean(subjectId, 'subjectId')}\u0000${clean(actorId, 'actorId')}`;
  return Object.freeze(reactions.filter((reaction) => reactionKey(reaction) !== key));
}

export function summarizeReactions(reactions: readonly Reaction[], subjectId: string): ReactionSummary {
  const normalizedSubjectId = clean(subjectId, 'subjectId');
  const byKind: Record<ReactionKind, number> = { like: 0, love: 0, insightful: 0, celebrate: 0, support: 0 };
  let total = 0;
  for (const reaction of reactions) {
    if (reaction.subjectId !== normalizedSubjectId) continue;
    byKind[reaction.kind] += 1;
    total += 1;
  }
  return Object.freeze({ subjectId: normalizedSubjectId, total, byKind: Object.freeze(byKind) });
}

export const REACTION_CHANGED_EVENT = 'sky.reaction.changed.v1' as const;
