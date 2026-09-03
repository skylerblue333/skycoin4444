import fs from "node:fs";
import { describe, expect, it } from "vitest";

const page = fs.readFileSync("client/src/pages/ActivityEvidence.tsx", "utf8");
const router = fs.readFileSync("server/routers/activityEvidence.ts", "utf8");
const app = fs.readFileSync("client/src/App.tsx", "utf8");
const workspace = fs.readFileSync("client/src/pages/BetaWorkspace.tsx", "utf8");

describe("activity evidence", () => {
  it("is a real account-owned beta route", () => {
    expect(app).toContain('path="/activity-evidence" component={ActivityEvidence}');
    expect(workspace).toContain('route: "/activity-evidence"');
    expect(page).toContain("trpc.activityEvidence.list.useQuery");
    expect(router).toContain("protectedProcedure");
    expect(router).toContain("eq(posts.userId, userId)");
    expect(router).toContain("eq(courseProgress.userId, userId)");
    expect(router).toContain("slice(0, 50)");
  });

  it("does not expose inferred metrics or financial/chain activity", () => {
    expect(page).toMatch(/not an analytics|not a performance dashboard/i);
    expect(page).toMatch(/No wallet or chain events/);
    expect(page).toMatch(/does not authorize or report payments/);
    expect(router).not.toMatch(/followers|engagement|revenue|balance|transaction|mainnet|wallet/);
  });
});
