import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dadForLater = fs.readFileSync(
  "client/src/components/DadForLater.tsx",
  "utf8"
);
const game = fs.readFileSync(
  "client/src/components/DadsGameNight.tsx",
  "utf8"
);
const index = fs.readFileSync(
  "docs/FAMILY-TIME-CAPSULE-INDEX.md",
  "utf8"
);

describe("Dad's Game Night family Easter egg", () => {
  it("is mounted inside Dad for Later and indexed for future discovery", () => {
    expect(dadForLater).toMatch(
      /import DadsGameNight from "@\/components\/DadsGameNight"/
    );
    expect(dadForLater).toContain("<DadsGameNight />");
    expect(index).toContain("Dad's Game Night");
    expect(index).toContain("DadsGameNight.tsx");
  });

  it("includes jokes, prompts, challenges, choices, and hidden pockets", () => {
    expect(game).toContain("Dad joke dispenser");
    expect(game).toContain("Dad says");
    expect(game).toContain("Ridiculous challenge");
    expect(game).toContain("Would you rather?");
    expect(game).toContain("Check Dad's pockets");
    expect(game).toContain("Snack tax exemption");
    expect(game).toContain("Emergency invisible high-five");
    expect(game).toContain("4:44 bonus");
  });

  it("implements a real local Dad-vs-kids rock paper scissors loop", () => {
    expect(game).toContain("Dad vs. Kids");
    expect(game).toContain("Rock · Paper · Scissors");
    expect(game).toContain('const rpsMoves = ["rock", "paper", "scissors"]');
    expect(game).toContain("function outcome");
    expect(game).toContain("function play");
    expect(game).toContain("Kids {childWins} · Dad {dadWins} · Ties {ties}");
    expect(game).toContain("Reset scoreboard");
    expect(game).toContain("You got me. Do not get too confident.");
  });

  it("keeps the play layer affectionate and future-facing", () => {
    expect(game).toContain("Come bother me in person");
    expect(game).toContain("The point was always spending time together");
    expect(game).toContain("nobody has to win to have a good night");
  });

  it("keeps game state local and non-persistent", () => {
    expect(game).toContain("not saved, tracked, or sent anywhere");
    expect(game).not.toMatch(/fetch\(/);
    expect(game).not.toMatch(/trpc\./);
    expect(game).not.toMatch(/localStorage/);
    expect(game).not.toMatch(/sessionStorage/);
    expect(game).not.toMatch(/document\.cookie/);
    expect(game).not.toMatch(/navigator\./);
  });
});
