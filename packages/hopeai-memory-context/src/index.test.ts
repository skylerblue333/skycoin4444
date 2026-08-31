import { describe, expect, it } from 'vitest';
import { selectContext } from './index';

const memories = [
  { id: 'mem:1', scope: 'project:sky4', content: 'alpha', priority: 50, createdAt: 100 },
  { id: 'mem:2', scope: 'project:sky4', content: 'beta', priority: 80, createdAt: 90 },
  { id: 'mem:3', scope: 'project:other', content: 'gamma', priority: 100, createdAt: 200 },
] as const;

describe('HopeAI memory context', () => {
  it('selects matching scope by deterministic priority order', () => {
    expect(selectContext({ memories, scope: 'project:sky4', maxItems: 10, maxChars: 100 }).map((item) => item.id))
      .toEqual(['mem:2', 'mem:1']);
  });

  it('honors item and character budgets', () => {
    expect(selectContext({ memories, scope: 'project:sky4', maxItems: 1, maxChars: 4 }).map((item) => item.id))
      .toEqual(['mem:2']);
  });

  it('rejects duplicate memory ids', () => {
    expect(() => selectContext({ memories: [memories[0], memories[0]], scope: 'project:sky4', maxItems: 10, maxChars: 100 }))
      .toThrow('duplicate memory id');
  });
});
