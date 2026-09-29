import fs from "node:fs";
import { describe, expect, it } from "vitest";

const routes = fs.readFileSync(
  "client/src/routes/legacy/LegacyRoutesGL.tsx",
  "utf8"
);

const legacyPages = [
  "client/src/pages/HopeAIPage.tsx",
  "client/src/pages/HopeAIUpgrades.tsx",
  "client/src/pages/HopeAIMeta.tsx",
  "client/src/pages/HOPEAIControl.tsx",
] as const;

describe("HopeAI legacy route convergence", () => {
  it.each(legacyPages)("%s delegates to the canonical workspace", file => {
    const source = fs.readFileSync(file, "utf8");
    expect(source).toContain('export { default } from "./HopeAIWorkspace";');
    expect(source).not.toMatch(/setTimeout\s*\(/);
    expect(source).not.toMatch(/Math\.random\s*\(/);
  });

  it("keeps legacy URLs available while the flagship routes stay canonical", () => {
    expect(routes).toMatch(
      /const HopeAI = lazy\(\(\) => import\('@\/pages\/HopeAIWorkspace'\)\)/
    );
    expect(routes).toMatch(/path="\/hope-a-i" component=\{HopeAI\}/);
    expect(routes).toMatch(/path="\/hope-a-i-page" component=\{HopeAIPage\}/);
    expect(routes).toMatch(/path="\/hope-a-i-upgrades" component=\{HopeAIUpgrades\}/);
    expect(routes).toMatch(/path="\/hope-a-i-meta" component=\{HopeAIMeta\}/);
    expect(routes).toMatch(/path="\/h-o-p-e-a-i-control" component=\{HOPEAIControl\}/);
  });
});
