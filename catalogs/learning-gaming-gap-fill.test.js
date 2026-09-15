import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'learning-gaming-gap-fill.json'), 'utf8'));

function assertUniqueIds(items, label) {
  const ids = items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, `${label} ids must be unique`);
}

test('course catalog has twenty-one tracks and eighteen authored gap cores', () => {
  assert.equal(catalog.courses.length, 21);
  assertUniqueIds(catalog.courses, 'course');
  assert.equal(catalog.courses.filter((course) => course.authoredGapCore).length, 18);
  assert.equal(catalog.courses.filter((course) => course.archiveBaseline).length, 3);
  for (const course of catalog.courses) {
    assert.match(course.id, /^[a-z0-9-]+$/);
    assert.ok(course.title.length >= 4);
    assert.ok(['beginner', 'intermediate', 'advanced'].includes(course.level));
    assert.ok(Number.isInteger(course.lessons) && course.lessons >= 5);
  }
});

test('all twenty-one catalog games now have a live beta surface and fourteen have local gap cores', () => {
  assert.equal(catalog.games.length, 21);
  assertUniqueIds(catalog.games, 'game');
  assert.equal(catalog.games.filter((game) => game.gapDomainCore).length, 14);
  assert.equal(catalog.games.filter((game) => game.existingSurface).length, 21);
  for (const game of catalog.games) {
    assert.equal(typeof game.existingSurface, 'boolean');
    assert.equal(typeof game.gapDomainCore, 'boolean');
  }
});

test('catalog does not claim production external services', () => {
  assert.equal(catalog.status, 'engineering-beta');
  assert.match(catalog.purpose, /does not claim live payments/i);
  assert.match(catalog.purpose, /does not claim.*wagering/i);
});
