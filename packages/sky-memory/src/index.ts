export type MemoryRecord = {
  id: string;
  namespace: string;
  content: string;
  tags: string[];
  createdAt: string;
};

export type MemoryQuery = {
  namespace: string;
  tags?: string[];
  limit?: number;
};

export type MemorySearchResult = {
  contract: "sky.memory.search.v1";
  namespace: string;
  records: MemoryRecord[];
};

function cleanText(value: string, field: string): string {
  const v = value.trim();
  if (!v) throw new Error(`${field} is required`);
  return v;
}

function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => cleanText(tag, "tag").toLowerCase()))].sort();
}

export class MemoryStore {
  private readonly records = new Map<string, MemoryRecord>();

  put(input: Omit<MemoryRecord, "tags"> & { tags?: string[] }): MemoryRecord {
    const id = cleanText(input.id, "id");
    const namespace = cleanText(input.namespace, "namespace");
    const content = cleanText(input.content, "content");
    const timestamp = Date.parse(input.createdAt);
    if (!Number.isFinite(timestamp)) throw new Error("createdAt must be an ISO-compatible timestamp");
    if (this.records.has(id)) throw new Error("id already exists");

    const record: MemoryRecord = {
      id,
      namespace,
      content,
      tags: normalizeTags(input.tags ?? []),
      createdAt: new Date(timestamp).toISOString(),
    };
    this.records.set(id, record);
    return structuredClone(record);
  }

  search(query: MemoryQuery): MemorySearchResult {
    const namespace = cleanText(query.namespace, "namespace");
    const tags = normalizeTags(query.tags ?? []);
    const limit = query.limit ?? 20;
    if (!Number.isSafeInteger(limit) || limit <= 0 || limit > 100) throw new Error("limit must be an integer from 1 to 100");

    const records = [...this.records.values()]
      .filter((record) => record.namespace === namespace)
      .filter((record) => tags.every((tag) => record.tags.includes(tag)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id))
      .slice(0, limit)
      .map((record) => structuredClone(record));

    return { contract: "sky.memory.search.v1", namespace, records };
  }
}
