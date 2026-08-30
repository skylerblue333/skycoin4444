import { describe, expect, it } from "vitest";
import { cosineSimilarity, searchVectors, toVectorQuery } from "./index";

describe("SkyVector", () => {
  it("computes cosine similarity deterministically", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBe(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
  });

  it("returns top matches with stable id tie-breaking", () => {
    const matches = searchVectors(
      [
        { id: "b", values: [1, 0], metadata: { kind: "two" } },
        { id: "a", values: [1, 0], metadata: { kind: "one" } },
        { id: "c", values: [0, 1] },
      ],
      [1, 0],
      2,
    );
    expect(matches.map((match) => match.id)).toEqual(["a", "b"]);
  });

  it("rejects invalid dimensions, zero vectors, duplicates, and non-finite values", () => {
    expect(() => cosineSimilarity([1], [1, 2])).toThrow("vector dimensions must match");
    expect(() => cosineSimilarity([0, 0], [1, 0])).toThrow("zero vectors cannot be compared");
    expect(() => searchVectors([{ id: "x", values: [1] }, { id: "x", values: [1] }], [1], 2)).toThrow(
      "duplicate vector id: x",
    );
    expect(() => toVectorQuery([Number.NaN], 1)).toThrow("query vector must contain only finite numbers");
  });

  it("emits a versioned provider-neutral vector query contract", () => {
    expect(toVectorQuery([0.25, 0.75], 3)).toEqual({
      type: "sky.vector.query.v1",
      values: [0.25, 0.75],
      topK: 3,
    });
  });
});
