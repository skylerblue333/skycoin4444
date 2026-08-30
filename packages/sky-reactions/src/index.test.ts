import { describe, expect, it } from 'vitest';
import { createReaction, removeReaction, summarizeReactions, upsertReaction } from './index';

describe('SkyReactions', () => {
  it('normalizes and validates reactions', () => {
    expect(createReaction({ subjectId: ' post-1 ', actorId: ' user-1 ', kind: 'like' })).toEqual({ subjectId: 'post-1', actorId: 'user-1', kind: 'like' });
    expect(() => createReaction({ subjectId: '', actorId: 'u', kind: 'like' })).toThrow('subjectId is required');
  });

  it('keeps one reaction per actor and subject', () => {
    const first = upsertReaction([], { subjectId: 'p', actorId: 'u', kind: 'like' });
    const replaced = upsertReaction(first, { subjectId: 'p', actorId: 'u', kind: 'love' });
    expect(replaced).toEqual([{ subjectId: 'p', actorId: 'u', kind: 'love' }]);
  });

  it('orders deterministically by subject and actor', () => {
    const reactions = upsertReaction(
      upsertReaction([], { subjectId: 'p', actorId: 'ä', kind: 'like' }),
      { subjectId: 'p', actorId: 'z', kind: 'love' },
    );
    expect(reactions.map((reaction) => reaction.actorId)).toEqual(['z', 'ä']);
  });

  it('removes reactions without affecting other actors', () => {
    const reactions = upsertReaction(
      upsertReaction([], { subjectId: 'p', actorId: 'a', kind: 'like' }),
      { subjectId: 'p', actorId: 'b', kind: 'support' },
    );
    expect(removeReaction(reactions, 'p', 'a')).toEqual([{ subjectId: 'p', actorId: 'b', kind: 'support' }]);
  });

  it('summarizes only the requested subject', () => {
    const reactions = [
      createReaction({ subjectId: 'p', actorId: 'a', kind: 'like' }),
      createReaction({ subjectId: 'p', actorId: 'b', kind: 'support' }),
      createReaction({ subjectId: 'q', actorId: 'c', kind: 'love' }),
    ];
    expect(summarizeReactions(reactions, 'p')).toEqual({
      subjectId: 'p',
      total: 2,
      byKind: { like: 1, love: 0, insightful: 0, celebrate: 0, support: 1 },
    });
  });
});
