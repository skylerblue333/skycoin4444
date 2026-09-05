import fs from "node:fs";
import { describe, expect, it } from "vitest";

const hope = fs.readFileSync("client/src/pages/HopeAI.tsx", "utf8");
const school = fs.readFileSync("client/src/pages/SkySchool.tsx", "utf8");
const gaming = fs.readFileSync("client/src/pages/Gaming.tsx", "utf8");
const rush = fs.readFileSync("client/src/pages/GameSkyRush.tsx", "utf8");
const tap = fs.readFileSync("client/src/pages/GameTokenTap.tsx", "utf8");
const quiz = fs.readFileSync("client/src/pages/GameCryptoQuiz.tsx", "utf8");
const builder = fs.readFileSync("client/src/pages/GameBlockBuilder.tsx", "utf8");
const impact = fs.readFileSync("client/src/pages/GamingForCharity.tsx", "utf8");
const navigation = fs.readFileSync(
  "client/src/components/BetaNavigation.tsx",
  "utf8"
);
const app = fs.readFileSync("client/src/App.tsx", "utf8");

describe("HopeAI + SkySchool + Gaming fun loop", () => {
  it("keeps HopeAI useful without fake external-model behavior", () => {
    expect(hope).toMatch(/createHopePlan/);
    expect(hope).toMatch(/activityEvidence\.list\.useQuery/);
    expect(hope).toMatch(/Deterministic · no external model/);
    expect(hope).toMatch(/does not send prompts to an external model/);
    expect(hope).not.toMatch(/startLogin/);
    expect(hope).not.toMatch(/Math\.random/);
    expect(hope).not.toMatch(/Better than ChatGPT/);
    expect(hope).not.toMatch(/tokensUsed/);
    expect(hope).not.toMatch(/confidence/);
  });

  it("grounds SkySchool in authored courses and persisted lesson evidence", () => {
    expect(school).toMatch(/gapCourses/);
    expect(school).toMatch(/activityEvidence\.list\.useQuery/);
    expect(school).toMatch(/event\.type === "lesson_completed"/);
    expect(school).toMatch(/href="\/game-sky-rush"/);
    expect(school).toMatch(/href="\/hope-a-i"/);
    expect(school).toMatch(/Practice XP\/Sparks have no cash or token value/);
    expect(school).not.toMatch(/students:/);
    expect(school).not.toMatch(/rating:/);
    expect(school).not.toMatch(/price:/);
    expect(school).not.toMatch(/world's best AI teacher/i);
  });

  it("promotes a replayable no-value game loop without fake platform stats", () => {
    expect(gaming).toMatch(/Sky Rush/);
    expect(gaming).toMatch(/href: "\/game-sky-rush"/);
    expect(gaming).toMatch(/Game-only\s+Sparks, XP, ranks, and scores have no monetary value/);
    expect(gaming).toMatch(/No real-money wagering, custody, prize settlement/);
    expect(gaming).not.toMatch(/platform\.stats/);
    expect(gaming).not.toMatch(/Active Players/);
    expect(gaming).not.toMatch(/prize pool/i);

    expect(rush).toMatch(/resolveRushTick/);
    expect(rush).toMatch(/dailySeed/);
    expect(rush).toMatch(/localStorage/);
    expect(rush).toMatch(/No wager · no cash value/);
    expect(rush).toMatch(/have no monetary value/);
    expect(rush).not.toMatch(/SKY444/);
  });

  it("removes fake donation/token transfer claims from promoted legacy games", () => {
    for (const source of [tap, quiz, builder]) {
      expect(source).not.toMatch(/SKY444/);
      expect(source).not.toMatch(/gaming-for-charity/);
      expect(source).not.toMatch(/donated to/i);
      expect(source).toMatch(/game-only|local game values/i);
    }
  });

  it("turns the old charity route into an honest non-financial impact lab", () => {
    expect(impact).toMatch(/Impact Play Lab/);
    expect(impact).toMatch(/No live donations/);
    expect(impact).toMatch(/No wallet, token payout, donation, settlement/);
    expect(impact).not.toMatch(/PLAY TO DONATE/);
    expect(impact).not.toMatch(/Active Players/);
    expect(impact).not.toMatch(/LEADERBOARD/);
    expect(impact).not.toMatch(/CHARITIES/);
    expect(impact).not.toMatch(/real SKY444 donations/);
  });

  it("routes navigation and app entry points into the canonical fun loop", () => {
    expect(navigation).toMatch(
      /label: "Learn", route: "\/sky-school"/
    );
    expect(navigation).toMatch(
      /label: "Gaming", route: "\/gaming"/
    );
    expect(navigation).toMatch(
      /label: "HopeAI", route: "\/hope-a-i"/
    );
    expect(app).toMatch(
      /const GameSkyRush = lazy\(\(\) => import\('\.\/pages\/GameSkyRush'\)\)/
    );
    expect(app).toMatch(
      /<Route path="\/game-sky-rush" component=\{GameSkyRush\} \/>/
    );
  });
});
