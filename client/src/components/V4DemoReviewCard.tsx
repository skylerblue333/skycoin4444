import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clipboard,
  Gauge,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  V4_DEMO_REVIEW_KEY,
  buildV4DemoReviewSummary,
  getV4DemoReviewAverage,
  getV4DemoReviewWeakest,
  isV4DemoReviewComplete,
  normalizeV4DemoReview,
  setV4DemoReviewRating,
  v4DemoReviewDimensions,
  type V4DemoReview,
  type V4DemoReviewDimensionId,
} from "@/lib/v4DemoReview";

const improvementPrompts: Record<V4DemoReviewDimensionId, string> = {
  clarity: "What was confusing, buried, or hard to understand without explanation?",
  usefulness: "Which product moment felt least valuable or least connected to a real need?",
  polish: "Where did the experience still feel like a prototype instead of a cohesive product?",
  trust: "Which claim, state, or boundary felt unclear, unsupported, or easy to misread?",
  returnIntent: "What would have to improve before you would voluntarily come back?",
};

function readReview() {
  if (typeof window === "undefined") return normalizeV4DemoReview(null);
  try {
    return normalizeV4DemoReview(
      JSON.parse(localStorage.getItem(V4_DEMO_REVIEW_KEY) ?? "null")
    );
  } catch {
    return normalizeV4DemoReview(null);
  }
}

function persistReview(review: V4DemoReview) {
  try {
    localStorage.setItem(V4_DEMO_REVIEW_KEY, JSON.stringify(review));
  } catch {
    // Review remains usable in memory if browser storage is unavailable.
  }
}

export default function V4DemoReviewCard() {
  const [review, setReview] = useState<V4DemoReview>(readReview);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );

  useEffect(() => persistReview(review), [review]);

  const average = getV4DemoReviewAverage(review);
  const complete = isV4DemoReviewComplete(review);
  const weakest = useMemo(() => getV4DemoReviewWeakest(review), [review]);

  function rate(id: V4DemoReviewDimensionId, value: string) {
    const rating = Number(value);
    if (!Number.isInteger(rating)) return;
    setReview(current => setV4DemoReviewRating(current, id, rating));
    setCopyState("idle");
  }

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(buildV4DemoReviewSummary(review));
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <section aria-labelledby="v4-demo-review-title">
      <Card className="border-violet-300/20 bg-violet-300/[0.035] text-white">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-violet-300/15 text-violet-100">
                  <Gauge className="mr-1 h-3.5 w-3.5" />
                  Demo review
                </Badge>
                <Badge variant="outline" className="border-white/10 text-white/45">
                  One tester · local only
                </Badge>
              </div>
              <h2 id="v4-demo-review-title" className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
                Don’t call it 10/10. Make testers score it.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/45">
                Rate the demo on five product dimensions. This score stays in this
                browser unless you deliberately copy it into the protected feedback
                form. It is subjective tester input—not analytics, adoption, or a
                market valuation.
              </p>
            </div>

            <div className="min-w-40 rounded-2xl border border-white/10 bg-black/20 p-5 text-center">
              <p className="text-4xl font-black text-white">
                {average === null ? "—" : average.toFixed(1)}
                <span className="text-lg text-white/30">/10</span>
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                current local average
              </p>
              <p className="mt-2 text-xs text-white/35">
                {complete ? "All five dimensions rated" : "Rate all five dimensions"}
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 lg:grid-cols-5">
            {v4DemoReviewDimensions.map(dimension => {
              const rating = review.ratings[dimension.id];
              return (
                <label
                  key={dimension.id}
                  className="rounded-2xl border border-white/10 bg-black/15 p-4"
                >
                  <span className="flex items-center justify-between gap-2">
                    <strong className="text-sm text-white/80">{dimension.label}</strong>
                    <span className="text-sm font-black text-violet-100/80">
                      {rating ? `${rating}/10` : "—"}
                    </span>
                  </span>
                  <span className="mt-2 block min-h-20 text-xs leading-5 text-white/35">
                    {dimension.prompt}
                  </span>
                  <select
                    value={rating ?? ""}
                    onChange={event => rate(dimension.id, event.target.value)}
                    className="mt-3 h-10 w-full rounded-xl border border-white/10 bg-[#090916] px-3 text-xs text-white outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
                    aria-label={`Rate ${dimension.label} from 1 to 10`}
                  >
                    <option value="">Rate 1–10</option>
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(value => (
                      <option key={value} value={value}>
                        {value}/10
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>

          {weakest.length ? (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {weakest.map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.035] p-4"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-100/55">
                    Improve {item.label} · {item.rating}/10
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/45">
                    {improvementPrompts[item.id]}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.08] pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-2xl gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-200/70" />
              <p className="text-xs leading-5 text-white/35">
                A high local review score is useful product feedback, but it does not
                establish production readiness, user retention, revenue, security
                certification, or external market demand.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!complete}
                onClick={copyReview}
              >
                {copyState === "copied" ? (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                ) : (
                  <Clipboard className="mr-2 h-4 w-4" />
                )}
                {copyState === "copied"
                  ? "Review copied"
                  : copyState === "failed"
                    ? "Copy unavailable"
                    : "Copy review"}
              </Button>
              {complete ? (
                <Link href="/beta-feedback?route=%2Fbeta-workspace&source=v4-demo-review">
                  <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send structured feedback
                  </Button>
                </Link>
              ) : (
                <Button type="button" disabled>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Rate all five to send feedback
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}