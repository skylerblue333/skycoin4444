import { createHash } from 'node:crypto';

export type BatchItem = Readonly<{ id: string; weight: number }>;
export type BatchWindow = Readonly<{ index: number; itemIds: readonly string[]; totalWeight: number }>;
export type BatchPlan = Readonly<{ windows: readonly BatchWindow[]; digest: string }>;

const ID_RE = /^[a-zA-Z0-9:_-]{2,96}$/;

export function planBatchWindows(items: readonly BatchItem[], maxItems: number, maxWeight: number): BatchPlan {
  if (!Number.isSafeInteger(maxItems) || maxItems < 1 || maxItems > 10_000) throw new Error('invalid maxItems');
  if (!Number.isSafeInteger(maxWeight) || maxWeight < 1) throw new Error('invalid maxWeight');
  if (items.length > 100_000) throw new Error('batch item limit exceeded');
  const seen = new Set<string>();
  const ordered = [...items].map((item) => {
    if (!ID_RE.test(item.id)) throw new Error(`invalid item id: ${item.id}`);
    if (!Number.isSafeInteger(item.weight) || item.weight < 1 || item.weight > maxWeight) throw new Error(`invalid item weight: ${item.id}`);
    if (seen.has(item.id)) throw new Error(`duplicate item id: ${item.id}`);
    seen.add(item.id);
    return item;
  }).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

  const windows: BatchWindow[] = [];
  let ids: string[] = [];
  let weight = 0;
  const flush = () => {
    if (!ids.length) return;
    windows.push(Object.freeze({ index: windows.length, itemIds: Object.freeze(ids), totalWeight: weight }));
    ids = [];
    weight = 0;
  };
  for (const item of ordered) {
    if (ids.length >= maxItems || weight + item.weight > maxWeight) flush();
    ids.push(item.id);
    weight += item.weight;
  }
  flush();
  const canonical = windows.map((window) => `${window.index}:${window.totalWeight}:${window.itemIds.join(',')}`).join('\n');
  const digest = createHash('sha256').update(`sky.batch.window.v1\n${canonical}`, 'utf8').digest('hex');
  return Object.freeze({ windows: Object.freeze(windows), digest });
}
