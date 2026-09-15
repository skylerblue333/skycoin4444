export type V4DemoReviewDimensionId =
  | "clarity"
  | "usefulness"
  | "polish"
  | "trust"
  | "returnIntent";

export type V4DemoReview = Readonly<{
  ratings: Readonly<Partial<Record<V4DemoReviewDimensionId, number>>>;
}>;

export const V4_DEMO_REVIEW_KEY = "sky4444.v4-demo-review.v1";

export const v4DemoReviewDimensions: readonly Readonly<{
  id: V4DemoReviewDimensionId;
  label: string;
  prompt: string;
}>[] = [
  {
    id: "clarity",
    label: "Clarity",
    prompt: "I immediately understand what SKYCOIN4444 is showing me and what to do next.",
  },
  {
    id: "usefulness",
    label: "Usefulness",
    prompt: "The demo shows workflows I could imagine using, testing, or recommending.",
  },
  {
    id: "polish",
    label: "Polish",
    prompt: "Navigation, copy, hierarchy, feedback, and transitions feel coherent rather than prototype-like.",
  },
  {
    id: "trust",
    label: "Trust",
    prompt: "The product makes it clear what is real, simulated, local-only, unavailable, or still beta.",
  },
  {
    id: "returnIntent",
    label: "Return intent",
    prompt: "After this demo I would voluntarily come back to try another workflow.",
  },
] as const;

const dimensionIds = new Set(v4DemoReviewDimensions.map(dimension => dimension.id));

function normalizeRating(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < 1 || rounded > 10) return null;
  return rounded;
}

export function normalizeV4DemoReview(value: unknown): V4DemoReview {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ratings: {} };
  }
  const candidate = value as Record<string, unknown>;
  const rawRatings =
    candidate.ratings &&
    typeof candidate.ratings === "object" &&
    !Array.isArray(candidate.ratings)
      ? (candidate.ratings as Record<string, unknown>)
      : {};

  const ratings: Partial<Record<V4DemoReviewDimensionId, number>> = {};
  for (const [id, raw] of Object.entries(rawRatings)) {
    if (!dimensionIds.has(id as V4DemoReviewDimensionId)) continue;
    const rating = normalizeRating(raw);
    if (rating !== null) ratings[id as V4DemoReviewDimensionId] = rating;
  }
  return { ratings };
}

export function setV4DemoReviewRating(
  review: V4DemoReview,
  id: V4DemoReviewDimensionId,
  rating: number
): V4DemoReview {
  const normalized = normalizeRating(rating);
  if (normalized === null) return review;
  return {
    ratings: {
      ...review.ratings,
      [id]: normalized,
    },
  };
}

export function getV4DemoReviewAverage(review: V4DemoReview) {
  const values = v4DemoReviewDimensions
    .map(dimension => review.ratings[dimension.id])
    .filter((value): value is number => typeof value === "number");
  if (!values.length) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

export function isV4DemoReviewComplete(review: V4DemoReview) {
  return v4DemoReviewDimensions.every(
    dimension => typeof review.ratings[dimension.id] === "number"
  );
}

export function getV4DemoReviewWeakest(review: V4DemoReview) {
  return v4DemoReviewDimensions
    .map(dimension => ({
      ...dimension,
      rating: review.ratings[dimension.id] ?? null,
    }))
    .filter(item => item.rating !== null)
    .sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
    .slice(0, 2);
}

export function buildV4DemoReviewSummary(review: V4DemoReview) {
  const average = getV4DemoReviewAverage(review);
  const lines = [
    `V4 demo review — ${average === null ? "incomplete" : `${average}/10 average`}`,
    ...v4DemoReviewDimensions.map(dimension =>
      `${dimension.label}: ${review.ratings[dimension.id] ?? "not rated"}/10`
    ),
    "",
    "This is one tester's browser-local subjective review, not analytics, production evidence, or a market rating.",
  ];
  return lines.join("\n");
}