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

test('course catalog has meaningful gap-fill coverage', () => {
  assert.ok(catalog.courses.length >= 12);
  assertUniqueIds(catalog.courses, 'course');
  for (const course of catalog.courses) {
    assert.match(course.id, /^[a-z0-9-]+$/);
    assert.ok(course.title.length >= 4);
    assert.ok(['beginner', 'intermediate', 'advanced'].includes(course.level));
    assert.ok(Number.isInteger(course.lessons) && course.lessons >= 5);
  }
});

test('game catalog records verified surfaces separately from gaps', () => {
  assert.ok(catalog.games.length >= 20);
  assertUniqueIds(catalog.games, 'game');
  for (const game of catalog.games) {
    assert.equal(typeof game.existingSurface, 'boolean');
  }
});

test('catalog does not claim production external services', () => {
  assert.equal(catalog.status, 'engineering-beta');
  assert.match(catalog.purpose, /does not claim live payments/i);
});
