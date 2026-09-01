const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'learning-gaming-gap-fill.json'), 'utf8')
);

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

test('game catalog distinguishes implemented surfaces from gaps', () => {
  assert.ok(catalog.games.length >= 20);
  assertUniqueIds(catalog.games, 'game');
  const implemented = catalog.games.filter((game) => game.existingSurface === true);
  const gaps = catalog.games.filter((game) => game.existingSurface === false);
  assert.ok(implemented.length >= 12);
  assert.ok(gaps.length >= 8);
});

test('catalog does not claim production external services', () => {
  assert.equal(catalog.status, 'engineering-beta');
  assert.match(catalog.purpose, /does not claim live payments/i);
});
