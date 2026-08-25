export interface CacheEntry<T> { value: T; expiresAt?: number; }

export class MemoryCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  set(key: string, value: T, options: { ttlMs?: number; now?: number } = {}): void {
    const normalized = key.trim();
    if (!normalized) throw new Error("key is required");
    if (options.ttlMs !== undefined && (!Number.isFinite(options.ttlMs) || options.ttlMs <= 0)) throw new Error("ttlMs must be positive");
    const now = options.now ?? Date.now();
    this.store.set(normalized, { value, expiresAt: options.ttlMs === undefined ? undefined : now + options.ttlMs });
  }

  get(key: string, now = Date.now()): T | undefined {
    const normalized = key.trim();
    if (!normalized) return undefined;
    const entry = this.store.get(normalized);
    if (!entry) return undefined;
    if (entry.expiresAt !== undefined && now >= entry.expiresAt) { this.store.delete(normalized); return undefined; }
    return entry.value;
  }

  delete(key: string): boolean { return this.store.delete(key.trim()); }
  clear(): void { this.store.clear(); }
  size(now = Date.now()): number {
    for (const key of [...this.store.keys()]) this.get(key, now);
    return this.store.size;
  }
}

export function stableCacheKey(namespace: string, parts: Array<string | number | boolean>): string {
  const ns = namespace.trim(); if (!ns) throw new Error("namespace is required");
  return `${ns}:${parts.map((part) => encodeURIComponent(String(part))).join(":")}`;
}
