export type MemoryItem = Readonly<{
  id: string;
  scope: string;
  content: string;
  priority: number;
  createdAt: number;
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{2,128}$/;
const SCOPE_RE = /^[a-zA-Z0-9:_-]{2,80}$/;

export function validateMemoryItem(item: MemoryItem): void {
  if (!ID_RE.test(item.id)) throw new Error('invalid memory id');
  if (!SCOPE_RE.test(item.scope)) throw new Error('invalid memory scope');
  if (item.content.length === 0 || item.content.length > 8000) throw new Error('memory content length must be 1-8000');
  if (!Number.isInteger(item.priority) || item.priority < 0 || item.priority > 100) throw new Error('priority must be 0-100');
  if (!Number.isSafeInteger(item.createdAt) || item.createdAt < 0) throw new Error('createdAt must be non-negative');
}

export function selectContext(input: {
  memories: readonly MemoryItem[];
  scope: string;
  maxItems: number;
  maxChars: number;
}): readonly MemoryItem[] {
  if (!SCOPE_RE.test(input.scope)) throw new Error('invalid memory scope');
  if (!Number.isInteger(input.maxItems) || input.maxItems < 1 || input.maxItems > 100) throw new Error('maxItems must be 1-100');
  if (!Number.isInteger(input.maxChars) || input.maxChars < 1 || input.maxChars > 100_000) throw new Error('maxChars must be 1-100000');
  const seen = new Set<string>();
  const candidates = input.memories.filter((item) => {
    validateMemoryItem(item);
    if (seen.has(item.id)) throw new Error('duplicate memory id');
    seen.add(item.id);
    return item.scope === input.scope;
  }).sort((a, b) => b.priority - a.priority || b.createdAt - a.createdAt || a.id.localeCompare(b.id));
  const selected: MemoryItem[] = [];
  let chars = 0;
  for (const item of candidates) {
    if (selected.length >= input.maxItems) break;
    if (chars + item.content.length > input.maxChars) continue;
    selected.push(item);
    chars += item.content.length;
  }
  return Object.freeze([...selected]);
}
