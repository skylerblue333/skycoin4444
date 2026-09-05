import fs from "node:fs";
import { describe, expect, it } from "vitest";

const feedback = fs.readFileSync("client/src/pages/BetaFeedback.tsx", "utf8");
const evidence = fs.readFileSync("client/src/pages/ActivityEvidence.tsx", "utf8");
const privacy = fs.readFileSync("client/src/pages/PrivacySettings.tsx", "utf8");
const navigation = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8"
);

describe("tester loop surfaces", () => {
  it("keeps feedback account-owned, route-aware, and activation-aware", () => {
    expect(feedback).toMatch(/href="\/signin"/);
    expect(feedback).not.toMatch(/startLogin/);
    expect(feedback).toMatch(/new URLSearchParams\(window\.location\.search\)/);
    expect(feedback).toMatch(/\.get\("route"\)/);
    expect(feedback).toMatch(/utils\.activation\.status\.invalidate/);
    expect(feedback).toMatch(/utils\.activityEvidence\.list\.invalidate/);
    expect(feedback).toMatch(/trimmed\.summary\.length >= 5/);
    expect(feedback).toMatch(/trimmed\.details\.length >= 10/);
    expect(feedback).toMatch(/Do not include passwords, access keys, seed\s+phrases/);
  });

  it("carries the current screen into the persistent feedback link", () => {
    expect(navigation).toMatch(
      /beta-feedback\?route=\$\{encodeURIComponent\(location\)\}/
    );
  });

  it("keeps activity evidence account-owned and non-analytic", () => {
    expect(evidence).toMatch(/href="\/signin"/);
    expect(evidence).toMatch(/events\.refetch\(\)/);
    expect(evidence).toMatch(/Latest 50 maximum/);
    expect(evidence).toMatch(/does not infer audience size, engagement, uptime/);
    expect(evidence).toMatch(/No wallet, payment, settlement, or chain events/);
    expect(evidence).not.toMatch(/startLogin/);
  });

  it("keeps privacy on canonical auth with explicit workflow limits", () => {
    expect(privacy).toMatch(/href="\/signin"/);
    expect(privacy).not.toMatch(/startLogin/);
    expect(privacy).toMatch(/const hasChange = visibility !== persistedVisibility/);
    expect(privacy).toMatch(/Automated verified full\s+purge is not yet implemented/);
    expect(privacy).toMatch(/do not claim regulatory certification/);
    expect(privacy).toMatch(/independent\s+identity verification/);
  });
});
