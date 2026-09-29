import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dashboard = fs.readFileSync("client/src/pages/Dashboard.tsx", "utf8");
const charity = fs.readFileSync("client/src/pages/Charity.tsx", "utf8");

describe("HopeAI and Impact flagship navigation", () => {
  it("promotes HopeAI and HopeAI Impact from the signed-in dashboard", () => {
    expect(dashboard).toContain('label: "HopeAI"');
    expect(dashboard).toContain('href: "/hope-a-i"');
    expect(dashboard).toContain('label: "HopeAI Impact"');
    expect(dashboard).toContain('href: "/charity"');
    expect(dashboard).toContain('href: "/sky-school"');
  });

  it("keeps the HopeAI Impact hero copy readable after the single-brand rebrand", () => {
    expect(charity).toMatch(
      /HopeAI includes an Impact workspace for useful planning, volunteer\s+capacity, impact evidence, and cross-ecosystem coordination\./
    );
    expect(charity).not.toContain("capacity, impact\\n");
    expect(charity).not.toContain("charity is verified, that money moved, or that a blockchain\\n");
  });
});
