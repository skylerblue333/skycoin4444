import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildV4DemoReviewSummary,
  v4DemoReviewDimensions,
} from "../../client/src/lib/v4DemoReview";

const workspace = fs.readFileSync("client/src/pages/BetaWorkspace.tsx", "utf8");
const reviewCard = fs.readFileSync(
  "client/src/components/V4DemoReviewCard.tsx",
  "utf8"
);
const director = fs.readFileSync(
  "client/src/components/V4DemoDirector.tsx",
  "utf8"
);
const feedback = fs.readFileSync("client/src/pages/BetaFeedback.tsx", "utf8");

describe("V4 measurable demo review loop", () => {
  it("puts the product demo and tester review before the advanced engineering console", () => {
    expect(workspace).toMatch(
      /<V4DemoDirector \/>[\s\S]*<V4DemoReviewCard \/>[\s\S]*<details[\s\S]*<V4Beta \/>/
    );
    expect(workspace).toContain("Advanced evidence");
    expect(workspace).toContain("Open the V4 mission & evidence command center");
  });

  it("scores five explicit product-quality dimensions from 1 to 10", () => {
    expect(v4DemoReviewDimensions.map(item => item.id)).toEqual([
      "clarity",
      "usefulness",
      "polish",
      "trust",
      "returnIntent",
    ]);
    expect(reviewCard).toContain("Don’t call it 10/10. Make testers score it.");
    expect(reviewCard).toContain("Rate 1–10");
    expect(reviewCard).toContain("current local average");
    expect(reviewCard).toContain("getV4DemoReviewWeakest");
  });

  it("keeps subjective ratings local and distinct from analytics or market proof", () => {
    expect(reviewCard).toContain("One tester · local only");
    expect(reviewCard).toContain("subjective tester input—not analytics");
    expect(reviewCard).toContain("external market demand");
    expect(buildV4DemoReviewSummary({ ratings: { clarity: 8 } })).toContain(
      "not analytics"
    );
  });

  it("preserves saved demo and review state instead of overwriting it on mount", () => {
    expect(director).toContain("useState<V4DemoSession>(initialDemoSession)");
    expect(director).not.toContain("setSession(normalizeV4DemoSession(readJson");
    expect(reviewCard).toContain("useState<V4DemoReview>(readReview)");
    expect(reviewCard).not.toContain("useEffect(() => setReview(readReview())");
  });

  it("hands a complete scorecard into protected structured feedback without fabricating expected or actual", () => {
    expect(reviewCard).toContain(
      "/beta-feedback?route=%2Fbeta-workspace&source=v4-demo-review"
    );
    expect(reviewCard).toContain("Rate all five to send feedback");
    expect(feedback).toContain('source !== "v4-demo-review"');
    expect(feedback).toContain("buildV4DemoReviewSummary(review)");
    expect(feedback).toContain("V4 demo review handoff");
    expect(feedback).toContain("Expected and actual are intentionally left for you to describe");
    expect(feedback).toContain('const [expected, setExpected] = useState("")');
    expect(feedback).toContain('const [actual, setActual] = useState("")');
  });
});