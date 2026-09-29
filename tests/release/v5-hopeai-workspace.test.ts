import fs from "node:fs";
import { describe, expect, it } from "vitest";

const routes = fs.readFileSync("client/src/routes/legacy/LegacyRoutesGL.tsx", "utf8");
const workspace = fs.readFileSync(
  "client/src/pages/HopeAIWorkspace.tsx",
  "utf8"
);
const advanced = fs.readFileSync(
  "client/src/pages/HopeAIAdvanced.tsx",
  "utf8"
);
const hopeAgentRouter = fs.readFileSync(
  "server/routers/hopeAgent.ts",
  "utf8"
);

describe("HopeAI conversation workspace release contract", () => {
  it("makes the provider-backed workspace the flagship HopeAI route", () => {
    expect(routes).toMatch(
      /const HopeAI = lazy\(\(\) => import\('@\/pages\/HopeAIWorkspace'\)\)/
    );
    expect(routes).toMatch(/path="\/hope-a-i" component=\{HopeAI\}/);
    expect(routes).toMatch(/path="\/hope-a-i-coach" component=\{HopeAICoach\}/);
    expect(advanced.trim()).toBe('export { default } from "./HopeAIWorkspace";');
  });

  it("uses the protected HopeAI agent router instead of simulated responses", () => {
    expect(workspace).toMatch(/trpc\.hopeAI\.catalog\.useQuery/);
    expect(workspace).toMatch(/trpc\.hopeAI\.run\.useMutation/);
    expect(workspace).toMatch(/trpc\.ai\.getModels\.useQuery/);
    expect(workspace).toMatch(/agentRun\.mutateAsync/);
    expect(workspace).not.toMatch(/trpc\.ai\.chat\.useMutation/);
    expect(workspace).not.toMatch(/setTimeout\(/);
    expect(workspace).not.toMatch(/thinkingTime/);
    expect(workspace).not.toMatch(/confidence:/);
    expect(workspace).not.toMatch(/Better than ChatGPT/);
  });

  it("fails closed at the provider boundary without reflecting upstream details", () => {
    expect(hopeAgentRouter).toMatch(/sanitizeOperationalError\(error\)/);
    expect(hopeAgentRouter).toMatch(/\[HopeAI\] agent provider failure:/);
    expect(hopeAgentRouter).toMatch(/message: "HopeAI agent request failed"/);
    expect(hopeAgentRouter).not.toMatch(
      /message: error instanceof Error \? error\.message/
    );
  });

  it("provides a tool-aware workspace without false external capability claims", () => {
    expect(workspace).toMatch(/New chat/);
    expect(workspace).toMatch(/Tools \+ outputs/);
    expect(workspace).toMatch(/Add text file/);
    expect(workspace).toMatch(/configured AI provider plus a/);
    expect(workspace).toMatch(/permissioned server-side tool runtime/);
    expect(workspace).toMatch(/localStorage\.setItem/);
    expect(workspace).toMatch(/storageKeyForUser\(user\.id\)/);
    expect(workspace).toMatch(/loadedStorageKey !== storageKey/);
    expect(workspace).toMatch(/aria-label="Saved conversation"/);
    expect(workspace).toMatch(/aria-label="Delete current conversation"/);
    expect(workspace).toMatch(/buildHopeProviderContent\(userMessage\)/);
    expect(workspace).toMatch(/capped at 8,000 characters/);
    expect(workspace).toMatch(/Beta boundary/);
    expect(workspace).toMatch(/Web browsing, email,/);
    expect(workspace).toMatch(/computer-use automation remain unavailable until/);
    expect(workspace).toMatch(/an explicit integration is connected and authorized/);
  });
});
