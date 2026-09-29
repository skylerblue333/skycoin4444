import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type RouteRecord = {
  path: string;
  component: string;
  label: string;
};

const read = (path: string) => readFileSync(path, "utf8");
const routeCatalog = JSON.parse(
  read("client/src/data/routeCatalog.json")
) as { routes: RouteRecord[] };

const canonicalRoutes = [
  { area: "HopeAI", path: "/hope-a-i", component: "HopeAI" },
  { area: "Social", path: "/activity-feed", component: "ActivityFeed" },
  { area: "Games", path: "/gaming", component: "Gaming" },
  { area: "Arcade", path: "/arcade", component: "Arcade" },
  { area: "Crash", path: "/game-crash", component: "GameCrash" },
  { area: "Blackjack", path: "/game-blackjack", component: "GameBlackjack" },
  { area: "Education", path: "/sky-school", component: "SkySchool" },
  { area: "Courses", path: "/course-catalog", component: "CourseCatalog" },
  { area: "Quiz", path: "/sky-school-quiz", component: "SkySchoolQuiz" },
  { area: "SkyHope", path: "/charity", component: "Charity" },
  { area: "Charity games", path: "/gaming-for-charity", component: "GamingForCharity" },
] as const;

describe("core ecosystem journey contract", () => {
  it("keeps every flagship experience on a stable canonical route", () => {
    for (const expected of canonicalRoutes) {
      const route = routeCatalog.routes.find(item => item.path === expected.path);
      expect(route, expected.area + " route missing").toBeTruthy();
      expect(route?.component).toBe(expected.component);
    }
  });

  it("keeps the global beta shell connected to the primary user areas", () => {
    const navigation = read("client/src/components/BetaNavigation.tsx");

    for (const path of [
      "/activity-feed",
      "/gaming",
      "/hope-a-i",
      "/sky-school",
      "/charity",
    ]) {
      expect(navigation, "navigation missing " + path).toContain(path);
    }
  });

  it("keeps the rebuilt games center connected to deep playable demo routes", () => {
    const gaming = read("client/src/pages/Gaming.tsx");

    expect(gaming).toContain('href: "/game-crash"');
    expect(gaming).toContain('href: "/arcade#plinko"');
    expect(gaming).toContain('href: "/arcade#high-low"');
    expect(gaming).toContain('href: "/game-blackjack"');
    expect(gaming).toContain('href: "/arcade#roulette"');
    expect(gaming).toContain("Demo credits only");
    expect(gaming).toMatch(/no cash or token value/i);
  });

  it("keeps social on persisted beta data instead of fixture engagement", () => {
    const social = read("client/src/pages/ActivityFeed.tsx");

    expect(social).toContain("trpc.feed.getFeed.useQuery");
    expect(social).toContain("trpc.social.createPost.useMutation");
    expect(social).toContain("trpc.social.likePost.useMutation");
    expect(social).toContain("trpc.social.addComment.useMutation");
  });

  it("documents the cross-area navigation and truth boundaries", () => {
    const docs = read("docs/CORE_EXPERIENCE_JOURNEYS.md");

    for (const path of canonicalRoutes.map(route => route.path)) {
      expect(docs).toContain("`" + path + "`");
    }
    expect(docs).toMatch(/engineering beta/i);
    expect(docs).toMatch(/no real-money gaming/i);
    expect(docs).toMatch(/no donation settlement/i);
    expect(docs).toMatch(/configured integration/i);
  });
});
