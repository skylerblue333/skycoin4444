import fs from "node:fs";
import { describe, expect, it } from "vitest";

const social = fs.readFileSync(
  "client/src/pages/ActivityFeed.tsx",
  "utf8"
);

describe("flagship social feed resilience", () => {
  it("distinguishes persisted-feed failure from an empty feed", () => {
    expect(social).toMatch(/feed\.isError/);
    expect(social).toMatch(/Feed unavailable/);
    expect(social).toMatch(/The feed could not be loaded\./);
    expect(social).toMatch(/not shown as empty when the persisted feed is unavailable/);
  });

  it("offers an accessible exact-query retry action", () => {
    expect(social).toMatch(/aria-label="Retry activity feed"/);
    expect(social).toMatch(/onClick=\{\(\) => feed\.refetch\(\)\}/);
    expect(social).toMatch(/feed\.isFetching/);
    expect(social).toMatch(/Retry feed/);
    expect(social).toMatch(/Retrying…/);
  });

  it("keeps the empty-state path separate from query failure", () => {
    expect(social).toMatch(/!feed\.isLoading && !feed\.isError && !posts\.length/);
    expect(social).toMatch(/No posts yet\./);
  });
});
