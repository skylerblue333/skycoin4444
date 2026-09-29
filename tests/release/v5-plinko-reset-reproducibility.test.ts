import fs from "node:fs";
import { describe, expect, it } from "vitest";

const plinko = fs.readFileSync("client/src/pages/GamePlinko.tsx", "utf8");

describe("Plinko reset reproducibility", () => {
  it("restores both demo credits and the deterministic seed baseline", () => {
    expect(plinko).toMatch(
      /function reset\(\)[\s\S]*setCredits\(1000\)[\s\S]*setSeed\(4444\)[\s\S]*setLastSeed\(4444\)/,
    );
    expect(plinko).toMatch(/No deposit, withdrawal, or transfer occurred/);
  });
});
