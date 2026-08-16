import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("truthful capability boundaries", () => {
  it("keeps the AI marketplace unavailable until commercial services are verified", () => {
    const source = readProjectFile("client/src/pages/AIAgentMarket.tsx");

    expect(source).toContain('FeatureUnavailable from "@/components/FeatureUnavailable"');
    expect(source).not.toMatch(/basicPrice|premiumPrice|powerPrice|usageCount|rating/);
    expect(source).not.toMatch(/toast\.success|Payment processing coming soon/);
  });

  it("keeps progress tracking unavailable until education records are verified", () => {
    const source = readProjectFile("client/src/pages/ProgressTracking.tsx");

    expect(source).toContain("FeatureUnavailable");
    expect(source).not.toMatch(/useState|<button|onClick|progress\s*[:=]/i);
  });

  it("keeps generic feature routers from returning fabricated success", () => {
    const source = readProjectFile("server/routers.ts");

    expect(source).toContain("const createFeatureRouter");
    expect(source).not.toMatch(/mutation\(\(\) => \(\{ success: true \}\)/);
    expect(source).toContain("updateProfile");
    expect(source).toContain("schema.users.username");
    expect(source).toContain("const feedRouter");
    expect(source).toContain("createPost(ctx.user.id");
    expect(source).toContain("storagePut(`users/${ctx.user.id}/avatar`");
  });

  it("does not return synthetic users or balances when database records are absent", () => {
    const source = readProjectFile("server/db.ts");

    expect(source).not.toContain('email: "user@example.com"');
    expect(source).not.toMatch(/getUserBy(?:Id|Email|OpenId)[\s\S]{0,500}return \{ id:/);
    expect(source).toContain("return null;");
    expect(source).toContain("schema.users.openId");
  });
});
