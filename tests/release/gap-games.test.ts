import { describe, expect, it } from 'vitest';
import {
  createMemoryDeck,
  createMinesBoard,
  gapGameCapabilities,
  isLegalCheckersStep,
  isLegalChessGeometry,
  isMemoryMatch,
  resolveHighLow,
  scoreTowerStack,
  scoreTrivia,
  validateWordChain,
} from '../../client/src/lib/gapGames';

describe('gap game engineering-beta domain cores', () => {
  it('resolves high-low deterministically including pushes', () => {
    expect(resolveHighLow(7, 9, 'higher')).toEqual({ outcome: 'win', delta: 1 });
    expect(resolveHighLow(7, 5, 'higher')).toEqual({ outcome: 'loss', delta: -1 });
    expect(resolveHighLow(7, 7, 'lower')).toEqual({ outcome: 'push', delta: 0 });
  });

  it('builds memory pairs and rejects matching a card with itself', () => {
    const deck = createMemoryDeck(['sky', 'coin']);
    expect(deck).toHaveLength(4);
    expect(isMemoryMatch(deck[0], deck[1])).toBe(true);
    expect(isMemoryMatch(deck[0], deck[0])).toBe(false);
  });

  it('validates word chains and repeated words', () => {
    expect(validateWordChain(['block', 'key', 'yield'])).toEqual({ valid: true, invalidIndex: -1 });
    expect(validateWordChain(['block', 'coin'])).toEqual({ valid: false, invalidIndex: 1 });
    expect(validateWordChain(['node', 'engine', 'node'])).toEqual({ valid: false, invalidIndex: 2 });
  });

  it('scores trivia without external services', () => {
    const questions = [
      { id: 'q1', choices: ['A', 'B'], correctIndex: 1 },
      { id: 'q2', choices: ['A', 'B'], correctIndex: 0 },
    ];
    expect(scoreTrivia(questions, { q1: 1, q2: 1 })).toEqual({ correct: 1, total: 2, percentage: 50 });
  });

  it('scores tower placement and stops at the first miss', () => {
    expect(scoreTowerStack([1, 0.8, 0, 1])).toEqual({ placed: 2, score: 290 });
  });

  it('generates deterministic mines adjacency values', () => {
    expect(createMinesBoard(3, 3, [4])).toEqual([1, 1, 1, 1, -1, 1, 1, 1, 1]);
    expect(() => createMinesBoard(3, 3, [4, 4])).toThrow(/mine placement/);
  });

  it('validates bounded checkers and chess geometry', () => {
    expect(isLegalCheckersStep(49, 40, 'red')).toBe(true);
    expect(isLegalCheckersStep(49, 42, 'red')).toBe(false);
    expect(isLegalChessGeometry('knight', 57, 42, 'white')).toBe(true);
    expect(isLegalChessGeometry('rook', 0, 7, 'white')).toBe(true);
    expect(isLegalChessGeometry('bishop', 0, 7, 'white')).toBe(false);
  });

  it('documents all eight gap cores without claiming full game services', () => {
    expect(Object.keys(gapGameCapabilities)).toHaveLength(8);
    expect(gapGameCapabilities.chess).toMatch(/remain.*work/i);
  });
});
