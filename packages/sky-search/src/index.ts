export type SearchDocument = {
  id: string;
  title: string;
  body?: string;
  tags?: string[];
  kind?: string;
};

export type SearchQuery = {
  text: string;
  limit?: number;
  tags?: string[];
  kind?: string;
};

export type SearchHit = {
  id: string;
  score: number;
  title: string;
  kind?: string;
  matchedTerms: string[];
};

export type SearchRequestedV1 = {
  type: "sky.search.requested.v1";
  query: string;
  limit: number;
  filters: { tags: string[]; kind?: string };
};

const normalize = (value: string): string[] =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

const cleanString = (value: string, field: string, max: number): string => {
  const cleaned = value.trim();
  if (!cleaned) throw new Error(`${field} is required`);
  if (cleaned.length > max) throw new Error(`${field} exceeds ${max} characters`);
  return cleaned;
};

const unique = (values: string[]): string[] => [...new Set(values.map((v) => v.trim()).filter(Boolean))];

const compareCodePoints = (left: string, right: string): number => {
  if (left === right) return 0;
  return left < right ? -1 : 1;
};

export function createSearchRequest(query: SearchQuery): SearchRequestedV1 {
  const text = cleanString(query.text, "query text", 512);
  const limit = query.limit ?? 20;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("limit must be an integer between 1 and 100");
  }
  return {
    type: "sky.search.requested.v1",
    query: text,
    limit,
    filters: {
      tags: unique(query.tags ?? []),
      ...(query.kind?.trim() ? { kind: query.kind.trim() } : {}),
    },
  };
}

export function searchDocuments(documents: SearchDocument[], query: SearchQuery): SearchHit[] {
  const request = createSearchRequest(query);
  const terms = unique(normalize(request.query));
  const hits: SearchHit[] = [];

  for (const doc of documents) {
    const id = cleanString(doc.id, "document id", 200);
    const title = cleanString(doc.title, "document title", 500);
    const docTags = unique(doc.tags ?? []);
    if (request.filters.kind && doc.kind !== request.filters.kind) continue;
    if (request.filters.tags.length && !request.filters.tags.every((tag) => docTags.includes(tag))) continue;

    const titleTokens = normalize(title);
    const bodyTokens = normalize(doc.body ?? "");
    const tagTokens = normalize(docTags.join(" "));
    const matchedTerms = terms.filter(
      (term) => titleTokens.includes(term) || bodyTokens.includes(term) || tagTokens.includes(term),
    );
    if (matchedTerms.length === 0) continue;

    const score = matchedTerms.reduce((total, term) => {
      const titleWeight = titleTokens.includes(term) ? 5 : 0;
      const tagWeight = tagTokens.includes(term) ? 3 : 0;
      const bodyWeight = bodyTokens.includes(term) ? 1 : 0;
      return total + titleWeight + tagWeight + bodyWeight;
    }, 0);

    const hit: SearchHit = { id, title, matchedTerms, score };
    if (doc.kind !== undefined) hit.kind = doc.kind;
    hits.push(hit);
  }

  return hits.sort((a, b) => b.score - a.score || compareCodePoints(a.id, b.id)).slice(0, request.limit);
}
