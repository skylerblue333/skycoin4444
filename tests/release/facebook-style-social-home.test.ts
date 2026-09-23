import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("Facebook-style social home", () => {
  it("keeps the canonical social route on persisted beta data", () => {
    const source = read("client/src/pages/ActivityFeed.tsx");

    expect(source).toContain("trpc.feed.getFeed.useQuery");
    expect(source).toContain("trpc.social.createPost.useMutation");
    expect(source).toContain("trpc.social.likePost.useMutation");
    expect(source).toContain("trpc.social.addComment.useMutation");
    expect(source).toContain("trpc.user.suggestedFollows.useQuery");
  });

  it("provides familiar social-home information architecture", () => {
    const source = read("client/src/pages/ActivityFeed.tsx");

    expect(source).toContain('label: "Home feed"');
    expect(source).toContain('label: "Friends & follows"');
    expect(source).toContain('label: "Communities"');
    expect(source).toContain('label: "Events"');
    expect(source).toContain('label: "Messages"');
    expect(source).toContain('label: "Saved"');
    expect(source).toContain('setFeedMode("saved")');
    expect(source).not.toContain('href: "/bookmarks"');
    expect(source).toContain("What's on your mind?");
    expect(source).toContain("Sign in to post");
    expect(source).toContain("Recent highlights");
    expect(source).toContain("posts.slice(0, 5)");
    expect(source).not.toContain('aria-label="Post options"');
    expect(source).toContain("Like");
    expect(source).toContain("Comment");
    expect(source).toContain("Share");
  });

  it("does not manufacture Facebook-like engagement data", () => {
    const source = read("client/src/pages/ActivityFeed.tsx");

    expect(source).toContain("Story-style cards derived from persisted feed records");
    expect(source).toContain("This social home intentionally avoids fake friends");
    expect(source).toContain("Saves and reports remain device-local");
    expect(source).not.toContain("12.4K");
    expect(source).not.toContain("44K");
    expect(source).not.toContain("Trending Tags");
  });

  it("keeps social discovery connected to real routed product areas", () => {
    const source = read("client/src/pages/ActivityFeed.tsx");

    expect(source).toContain('href: "/social-graph"');
    expect(source).toContain('href: "/community"');
    expect(source).toContain('href: "/social-events"');
    expect(source).toContain('href: "/unified-messaging"');
    expect(source).toContain('href: "/reels"');
  });
});
