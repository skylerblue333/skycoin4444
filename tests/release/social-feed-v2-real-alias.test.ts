import fs from "node:fs";
import { describe, expect, it } from "vitest";

const alias = fs.readFileSync("client/src/pages/SocialFeedV2.tsx", "utf8");
const socialHome = fs.readFileSync("client/src/pages/ActivityFeed.tsx", "utf8");
const routes = fs.readFileSync(
  "client/src/routes/legacy/LegacyRoutesSZ.tsx",
  "utf8"
);

describe("legacy SocialFeedV2 release boundary", () => {
  it("routes the legacy social-feed-v2 surface to the persisted social home", () => {
    expect(alias.trim()).toBe('export { default } from "./ActivityFeed";');
    expect(routes).toMatch(
      /const SocialFeedV2 = lazy\(\(\) => import\('@\/pages\/SocialFeedV2'\)\)/
    );
    expect(routes).toMatch(/path="\/social-feed-v2" component=\{SocialFeedV2\}/);
  });

  it("keeps the canonical social home backed by real beta procedures", () => {
    expect(socialHome).toContain("trpc.feed.getFeed.useQuery");
    expect(socialHome).toContain("trpc.social.createPost.useMutation");
    expect(socialHome).toContain("trpc.social.likePost.useMutation");
    expect(socialHome).toContain("trpc.social.comments.useQuery");
    expect(socialHome).toContain("trpc.social.addComment.useMutation");
    expect(socialHome).not.toContain("Alex Chen");
    expect(socialHome).not.toContain("245000");
    expect(socialHome).not.toContain("234K");
  });
});
