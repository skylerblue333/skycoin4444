import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dashboard = fs.readFileSync("client/src/pages/Dashboard.tsx", "utf8");
const signin = fs.readFileSync("client/src/pages/Signin.tsx", "utf8");
const onboarding = fs.readFileSync("client/src/pages/Onboarding.tsx", "utf8");
const navigation = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8"
);

describe("canonical entry-flow UI", () => {
  it("keeps the dashboard grounded in account-owned persisted evidence", () => {
    expect(dashboard).toMatch(/trpc\.activation\.status\.useQuery/);
    expect(dashboard).toMatch(/trpc\.activityEvidence\.list\.useQuery/);
    expect(dashboard).toMatch(/Account-owned evidence only/);
    expect(dashboard).toMatch(/No fabricated online-user or engagement counts/);

    expect(dashboard).not.toMatch(/Math\.random/);
    expect(dashboard).not.toMatch(/LIVE_ACTIVITIES/);
    expect(dashboard).not.toMatch(/PLATFORM_STATS/);
    expect(dashboard).not.toMatch(/CRYPTO_CARDS/);
    expect(dashboard).not.toMatch(/user\.openId === user\.openId/);
    expect(dashboard).not.toMatch(/847K/);
    expect(dashboard).not.toMatch(/trade executed/i);
    expect(dashboard).not.toMatch(/staking reward claimed/i);
  });

  it("routes logged-out dashboard users through the canonical beta sign-in", () => {
    expect(dashboard).toMatch(/href="\/signin"/);
    expect(dashboard).not.toMatch(/getLoginUrl/);
    expect(dashboard).not.toMatch(/startLogin/);
  });

  it("keeps onboarding auth-mode neutral and uses the canonical sign-in page", () => {
    expect(onboarding).toMatch(/href="\/signin"/);
    expect(onboarding).toMatch(/configured invitation sign-in mode/);
    expect(onboarding).not.toMatch(/startLogin/);
    expect(onboarding).not.toMatch(/Sign in with provider/);
  });

  it("shows bounded rate-limit feedback on the access-key sign-in surface", () => {
    expect(signin).toMatch(/rateLimit:/);
    expect(signin).toMatch(/response\.status === 429/);
    expect(signin).toMatch(/Retry-After/);
    expect(signin).toMatch(/retrySeconds/);
    expect(signin).toMatch(/aria-live="polite"/);
    expect(signin).toMatch(/Show access key/);
    expect(signin).toMatch(/Hide access key/);
    expect(signin).toMatch(/payload\.redirect \|\| "\/dashboard"/);
  });

  it("makes account entry discoverable from the persistent beta navigation", () => {
    expect(navigation).toMatch(/useAuth\(\)/);
    expect(navigation).toMatch(/isAuthenticated \? "\/dashboard" : "\/signin"/);
    expect(navigation).toMatch(/Open invitation sign in/);
    expect(navigation).toMatch(/Open account dashboard/);
  });
});
