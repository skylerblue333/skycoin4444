import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");
const read = (relative: string) => fs.readFileSync(path.join(root, relative), "utf8");

describe("learning and focused gaming UI integration", () => {
  it("replaces the empty CourseCatalog placeholder with authored curriculum", () => {
    const source = read("client/src/pages/CourseCatalog.tsx");
    expect(source).toContain("gapCourses");
    expect(source).toContain("Record lesson completion");
    expect(source).toContain("durable progress requires an invited account");
    expect(source).not.toContain("No data available. Start by creating a new item.");
  });

  it("exposes the rebuilt flagship arcade instead of the fourteen-mode gap catalog", () => {
    const source = read("client/src/pages/Arcade.tsx");
    for (const marker of [
      "Plinko Lab",
      "High-Low",
      "Roulette",
      "Crypto Ops",
      "Hash Hunt",
      "Wallet Defense",
    ]) {
      expect(source).toContain(marker);
    }
    for (const retiredMarker of [
      "Memory Match",
      "Word Chain",
      "Tower Stack",
      "Web3 Chess",
      "Assembly Puzzle",
    ]) {
      expect(source).not.toContain(retiredMarker);
    }
    expect(source).not.toContain("SKY444 Wagering");
    expect(source).toContain("No cash or token value");
  });

  it("keeps the historical learning-gaming catalog as compatibility metadata", () => {
    const catalog = JSON.parse(read("catalogs/learning-gaming-gap-fill.json"));
    expect(catalog.games).toHaveLength(21);
    expect(catalog.games.filter((game: { existingSurface: boolean }) => game.existingSurface)).toHaveLength(21);
    expect(catalog.games.filter((game: { gapDomainCore: boolean }) => game.gapDomainCore)).toHaveLength(14);
  });
});
