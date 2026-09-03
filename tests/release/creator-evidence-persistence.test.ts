import fs from "node:fs";
import { describe, expect, it } from "vitest";

const page = fs.readFileSync("client/src/pages/CreatorAnalytics.tsx", "utf8");
const router = fs.readFileSync("server/routers/creatorEvidence.ts", "utf8");
const schema = fs.readFileSync("drizzle/schema.ts", "utf8");
const migration = fs.readFileSync("drizzle/migrations/0007_creator_evidence_drafts.sql", "utf8");

describe("creator evidence persistence", () => {
  it("uses durable authenticated creator procedures", () => {
    expect(page).toContain("trpc.creatorEvidence.list.useQuery");
    expect(page).toContain("trpc.creatorEvidence.create.useMutation");
    expect(page).toContain("trpc.creatorEvidence.setStatus.useMutation");
    expect(router).toContain("protectedProcedure");
    expect(router).toContain("eq(creatorEvidenceDrafts.userId, ctx.user.id)");
    expect(schema).toContain("creatorEvidenceDrafts = mysqlTable(\"creator_evidence_drafts\"");
    expect(migration).toContain("CREATE TABLE `creator_evidence_drafts`");
  });

  it("keeps publishing and monetization claims unavailable", () => {
    expect(page).toMatch(/Analytics: unavailable/);
    expect(page).toMatch(/Revenue and payouts: unavailable/);
    expect(page).toMatch(/Publishing integrations: unavailable/);
    expect(page).not.toMatch(/followers:\s*\d|revenue:\s*\d|payout:\s*\d|publishedAt:/);
  });
});
