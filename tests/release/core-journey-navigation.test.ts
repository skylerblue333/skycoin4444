import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("core HopeAI + SkyHope navigation journey", () => {
  it("promotes the five-step beta loop from the public launchpad", () => {
    const home = read("client/src/pages/Home.tsx");

    expect(home).toContain('id: "social"');
    expect(home).toContain('id: "learn"');
    expect(home).toContain('id: "play"');
    expect(home).toContain('id: "help"');
    expect(home).toContain('id: "explore"');
    expect(home).toContain('label: "Build one SkyHope action plan"');
  });

  it("makes HopeAI and SkyHope first-class public destinations", () => {
    const home = read("client/src/pages/Home.tsx");

    expect(home).toContain('title: "HopeAI"');
    expect(home).toContain('href: "/hope-a-i"');
    expect(home).toContain('title: "SkyHope"');
    expect(home).toContain('href: "/charity"');
    expect(home).toContain("Ask HopeAI. Turn the answer into an impact plan.");
    expect(home).toContain("Engineering beta boundary");
  });

  it("keeps learning, gaming, social and impact connected without financial claims", () => {
    const home = read("client/src/pages/Home.tsx");

    expect(home).toContain('href: "/sky-school"');
    expect(home).toContain('href: "/gaming"');
    expect(home).toContain('href: "/activity-feed"');
    expect(home).toContain("do not by themselves execute donations");
    expect(home).toContain("verify charities or beneficiaries");
    expect(home).toContain("prove real-world outcomes");
  });

  it("gives signed-in users direct HopeAI and SkyHope launch paths", () => {
    const dashboard = read("client/src/pages/Dashboard.tsx");

    expect(dashboard).toContain('{ label: "HopeAI"');
    expect(dashboard).toContain('href: "/hope-a-i"');
    expect(dashboard).toContain('{ label: "SkyHope"');
    expect(dashboard).toContain('href: "/charity"');
    expect(dashboard).toContain('{ label: "Social"');
    expect(dashboard).toContain('{ label: "Gaming"');
    expect(dashboard).toContain('{ label: "SkySchool"');
  });
});
