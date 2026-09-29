import fs from "node:fs";
import { describe, expect, it } from "vitest";

const charityRouter = fs.readFileSync("server/routers/charity.ts", "utf8");

describe("HopeAI Impact pledge retry boundary", () => {
  it("converges concurrent idempotent pledge retries on the existing intent", () => {
    expect(charityRouter).toContain("isImpactIdempotencyConflict(error)");
    expect(charityRouter).toContain("const replayRows = await db");
    expect(charityRouter).toContain("eq(charityPledges.idempotencyKey, input.idempotencyKey)");
    expect(charityRouter).toContain("if (!replay) throw error");
    expect(charityRouter).toContain("created: false as const");
    expect(charityRouter).toContain("settlementExecuted: false as const");
    expect(charityRouter).toContain("paymentProviderCalled: false as const");
  });
});
