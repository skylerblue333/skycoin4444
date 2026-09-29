import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");
const read = (relative: string) => fs.readFileSync(path.join(root, relative), "utf8");

describe("playable flagship tables and learning depth", () => {
  it("routes dedicated Plinko, High-Low, and Roulette pages", () => {
    const routes = read("client/src/routes/legacy/LegacyRoutesGL.tsx");
    expect(routes).toContain("GamePlinko");
    expect(routes).toContain('path="/game-plinko"');
    expect(routes).toContain("GameHighLow");
    expect(routes).toContain('path="/game-high-low"');
    expect(routes).toContain("GameRoulette");
    expect(routes).toContain('path="/game-roulette"');
  });

  it("uses the shared deterministic flagship engine rather than fake outcome fixtures", () => {
    const plinko = read("client/src/pages/GamePlinko.tsx");
    const highLow = read("client/src/pages/GameHighLow.tsx");
    const roulette = read("client/src/pages/GameRoulette.tsx");

    expect(plinko).toContain("simulatePlinko");
    expect(plinko).toContain("PLINKO_MULTIPLIERS_10");
    expect(plinko).toMatch(/function reset\(\)[\s\S]*setSeed\(4444\)[\s\S]*setLastSeed\(4444\)/);
    expect(highLow).toContain("nextCardRank");
    expect(highLow).toContain("resolveHighLow");
    expect(roulette).toContain("spinRoulette");
    expect(roulette).toContain("roulettePayoutMultiplier");
  });

  it("keeps all three wagering-like surfaces explicitly non-financial", () => {
    for (const source of [
      read("client/src/pages/GamePlinko.tsx"),
      read("client/src/pages/GameHighLow.tsx"),
      read("client/src/pages/GameRoulette.tsx"),
    ]) {
      expect(source).toMatch(/demo credits/i);
      expect(source).toMatch(/DemoBoundary/);
    }
    expect(read("client/src/pages/GameRoulette.tsx")).toMatch(/not cryptographic randomness|not a regulated gaming product/i);
  });

  it("turns SchoolQuiz results into a deterministic remediation plan", () => {
    const engine = read("client/src/lib/quizEngine.ts");
    const quiz = read("client/src/pages/SchoolQuiz.tsx");
    expect(engine).toContain("buildQuizReviewPlan");
    expect(engine).toContain("weakestCategories");
    expect(quiz).toContain("Targeted review plan");
    expect(quiz).toContain("Ask HopeAI to explain a missed concept");
    expect(quiz).toMatch(/not an academic assessment or accredited credential/i);
  });
});
