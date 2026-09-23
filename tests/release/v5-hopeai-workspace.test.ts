import fs from "node:fs";
import { describe, expect, it } from "vitest";

const app = fs.readFileSync("client/src/App.tsx", "utf8");
const workspace = fs.readFileSync(
  "client/src/pages/HopeAIWorkspace.tsx",
  "utf8"
);
const advanced = fs.readFileSync(
  "client/src/pages/HopeAIAdvanced.tsx",
  "utf8"
);

describe("HopeAI conversation workspace release contract", () => {
  it("makes the provider-backed workspace the flagship HopeAI route", () => {
    expect(app).toMatch(
      /const HopeAI = lazy\(\(\) => import\('\.\/pages\/HopeAIWorkspace'\)\)/
    );
    expect(app).toMatch(/path="\/hope-a-i" component=\{HopeAI\}/);
    expect(app).toMatch(/path="\/hope-a-i-coach" component=\{HopeAICoach\}/);
    expect(advanced.trim()).toBe('export { default } from "./HopeAIWorkspace";');
  });

  it("uses the real protected HopeAI agent router instead of simulated responses", () => {
    expect(workspace).toMatch(/trpc\.hopeAI\.run\.useMutation/);
    expect(workspace).toMatch(/trpc\.hopeAI\.catalog\.useQuery/);
    expect(workspace).toMatch(/trpc\.ai\.getModels\.useQuery/);
    expect(workspace).toMatch(/agentRun\.mutateAsync/);
    expect(workspace).not.toMatch(/setTimeout\(/);
    expect(workspace).not.toMatch(/thinkingTime/);
    expect(workspace).not.toMatch(/confidence:/);
    expect(workspace).not.toMatch(/Better than ChatGPT/);
  });

  it("provides ChatGPT\/Manus-style workspace affordances without false parity claims", () => {
    expect(workspace).toMatch(/New chat/);
    expect(workspace).toMatch(/Tools \+ outputs/);
    expect(workspace).toMatch(/Add text file/);
    expect(workspace).toMatch(/Tool-enabled agent runtime/);
    expect(workspace).toMatch(/localStorage\.setItem/);
    expect(workspace).toMatch(/storageKeyForUser\(user\.id\)/);
    expect(workspace).toMatch(/loadedStorageKey !== storageKey/);
    expect(workspace).toMatch(/aria-label="Saved conversation"/);
    expect(workspace).toMatch(/aria-label="Delete current conversation"/);
    expect(workspace).toMatch(/buildHopeProviderContent\(userMessage\)/);
    expect(workspace).toMatch(/capped at 8,000 characters/);
    expect(workspace).toMatch(/computer-use automation remain unavailable until/);
    expect(workspace).toMatch(/explicit integration is connected and authorized/);
    expect(workspace).toMatch(/Tool execution/);
  });
});
