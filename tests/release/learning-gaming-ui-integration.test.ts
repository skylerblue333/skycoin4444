import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '../..');
const read = (relative: string) => fs.readFileSync(path.join(root, relative), 'utf8');

describe('learning and gaming UI gap integration', () => {
  it('replaces the empty CourseCatalog placeholder with authored curriculum', () => {
    const source = read('client/src/pages/CourseCatalog.tsx');
    expect(source).toContain('gapCourses');
    expect(source).toContain('Record lesson completion');
    expect(source).toContain('durable progress requires an invited account');
    expect(source).not.toContain('No data available. Start by creating a new item.');
  });

  it('exposes all thirteen gap-game experiences through Arcade', () => {
    const source = read('client/src/pages/Arcade.tsx');
    for (const marker of ['High-Low', 'Memory Match', 'Word Chain', 'Crypto Trivia', 'Tower Stack', 'Mines', 'Web3 Chess', 'Checkers', 'Dice', 'Roulette', 'Snake', 'Tic-Tac-Toe', 'Assembly Puzzle']) {
      expect(source).toContain(marker);
    }
    expect(source).not.toContain('SKY444 Wagering');
    expect(source).toContain('No real-money wagering');
  });

  it('keeps the canonical catalog aligned with twenty surfaced games', () => {
    const catalog = JSON.parse(read('catalogs/learning-gaming-gap-fill.json'));
    expect(catalog.games).toHaveLength(20);
    expect(catalog.games.filter((game: { existingSurface: boolean }) => game.existingSurface)).toHaveLength(20);
    expect(catalog.games.filter((game: { gapDomainCore: boolean }) => game.gapDomainCore)).toHaveLength(13);
  });
});
