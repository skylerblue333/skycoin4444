export interface VectorRecord {
  id: string;
  values: readonly number[];
  metadata?: Readonly<Record<string, string>>;
}

export interface VectorMatch {
  id: string;
  score: number;
  metadata?: Readonly<Record<string, string>>;
}

export interface VectorQueryV1 {
  type: "sky.vector.query.v1";
  values: readonly number[];
  topK: number;
}

function validateVector(values: readonly number[], label: string): void {
  if (values.length === 0) throw new Error(`${label} must not be empty`);
  for (const value of values) {
    if (!Number.isFinite(value)) throw new Error(`${label} must contain only finite numbers`);
  }
}

export function cosineSimilarity(left: readonly number[], right: readonly number[]): number {
  validateVector(left, "left vector");
  validateVector(right, "right vector");
  if (left.length !== right.length) throw new Error("vector dimensions must match");

  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    const l = left[index];
    const r = right[index];
    dot += l * r;
    leftNorm += l * l;
    rightNorm += r * r;
  }
  if (leftNorm === 0 || rightNorm === 0) throw new Error("zero vectors cannot be compared");
  return dot / Math.sqrt(leftNorm * rightNorm);
}

export function searchVectors(
  records: readonly VectorRecord[],
  query: readonly number[],
  topK: number,
): VectorMatch[] {
  validateVector(query, "query vector");
  if (!Number.isSafeInteger(topK) || topK <= 0) throw new Error("topK must be a positive safe integer");

  const seen = new Set<string>();
  const matches = records.map((record) => {
    if (!record.id.trim()) throw new Error("record id is required");
    if (seen.has(record.id)) throw new Error(`duplicate vector id: ${record.id}`);
    seen.add(record.id);
    return {
      id: record.id,
      score: cosineSimilarity(query, record.values),
      metadata: record.metadata,
    };
  });

  return matches
    .sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .slice(0, topK);
}

export function toVectorQuery(values: readonly number[], topK: number): VectorQueryV1 {
  validateVector(values, "query vector");
  if (!Number.isSafeInteger(topK) || topK <= 0) throw new Error("topK must be a positive safe integer");
  return { type: "sky.vector.query.v1", values: [...values], topK };
}
