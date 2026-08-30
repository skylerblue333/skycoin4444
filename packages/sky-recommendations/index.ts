export const SKY_RECOMMENDATIONS_CONTRACT = "sky.recommendations.ranked.v1" as const;

export type RecommendationCandidate = {
  id: string;
  relevance: number;
  affinity?: number;
};

export type RankedRecommendation = {
  id: string;
  score: number;
  rank: number;
};

function requireId(value: string): string {
  const id = value.trim();
  if (!id) throw new Error("candidate id is required");
  return id;
}

function requireUnit(value: number, field: string): number {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error(`${field} must be between 0 and 1`);
  return value;
}

export function rankRecommendations(candidates: RecommendationCandidate[], limit = candidates.length): RankedRecommendation[] {
  if (!Array.isArray(candidates) || candidates.length === 0) throw new Error("candidates are required");
  if (!Number.isSafeInteger(limit) || limit <= 0) throw new Error("limit must be a positive safe integer");

  const seen = new Set<string>();
  const scored = candidates.map((candidate) => {
    const id = requireId(candidate.id);
    if (seen.has(id)) throw new Error("candidate ids must be unique");
    seen.add(id);
    const relevance = requireUnit(candidate.relevance, "relevance");
    const affinity = requireUnit(candidate.affinity ?? 0, "affinity");
    const score = Math.round((relevance * 0.75 + affinity * 0.25) * 10000) / 10000;
    return { id, score };
  });

  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return scored.slice(0, limit).map((item, index) => ({ ...item, rank: index + 1 }));
}
