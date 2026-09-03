import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync("client/src/pages/DiscoveryCenter.tsx", "utf8");
const app = fs.readFileSync("client/src/App.tsx", "utf8");

describe("discovery center", () => {
  it("is registered and connects approved search and notification procedures", () => {
    expect(app).toMatch(/path="\/discovery-center" component=\{DiscoveryCenter\}/);
    expect(source).toContain("trpc.search.discover.useQuery");
    expect(source).toContain("trpc.notifications.list.useQuery");
    expect(source).toContain("trpc.notifications.markRead.useMutation");
    expect(source).toContain("trpc.notifications.markAllRead.useMutation");
  });

  it("labels browser-local bookmarks and prevents unsupported claims", () => {
    expect(source).toContain("browser-local");
    expect(source).toContain("BOOKMARK_KEY");
    expect(source).toMatch(/No transactions or purchases/);
    expect(source).toMatch(/No wallet or chain lookups/);
    expect(source).not.toMatch(/purchaseVolume:|searchVolume:|rankingScore:|walletBalance:|transferCount:/);
  });
});
