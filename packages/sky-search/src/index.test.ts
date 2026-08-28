import { describe, expect, it } from "vitest";
import { createSearchRequest, searchDocuments } from "./index";

describe("SkySearch", () => {
  it("ranks deterministic lexical matches", () => {
    const hits = searchDocuments(
      [
        { id: "b", title: "Sky Wallet", body: "secure account search", tags: ["finance"] },
        { id: "a", title: "Search Console", body: "wallet operations", tags: ["admin"] },
      ],
      { text: "wallet search" },
    );
    expect(hits.map((hit) => hit.id)).toEqual(["a", "b"]);
    expect(hits[0]?.matchedTerms).toEqual(["wallet", "search"]);
  });

  it("applies kind and tag filters", () => {
    const hits = searchDocuments(
      [
        { id: "1", title: "Alpha Search", tags: ["public"], kind: "page" },
        { id: "2", title: "Alpha Search", tags: ["private"], kind: "page" },
      ],
      { text: "alpha", tags: ["public"], kind: "page" },
    );
    expect(hits).toHaveLength(1);
    expect(hits[0]?.id).toBe("1");
  });

  it("normalizes the integration request and validates bounds", () => {
    expect(createSearchRequest({ text: "  hello  ", tags: ["x", "x"], limit: 5 })).toEqual({
      type: "sky.search.requested.v1",
      query: "hello",
      limit: 5,
      filters: { tags: ["x"] },
    });
    expect(() => createSearchRequest({ text: "x", limit: 101 })).toThrow(/limit/);
    expect(() => createSearchRequest({ text: "   " })).toThrow(/required/);
  });
});
