import { describe, expect, it } from "vitest";
import { planExport } from "./index";

describe("SkyDataExport", () => {
  it("creates deterministic sorted manifests", () => {
    expect(
      planExport({
        subjectId: "user:1",
        dataset: "profile",
        format: "jsonl",
        fields: ["name", "id"],
      }).fields
    ).toEqual(["id", "name"]);
  });

  it("rejects duplicate fields", () => {
    expect(() =>
      planExport({
        subjectId: "user:1",
        dataset: "profile",
        format: "csv",
        fields: ["id", "id"],
      })
    ).toThrow("duplicate field");
  });

  it("requires at least one field", () => {
    expect(() =>
      planExport({ subjectId: "user:1", dataset: "profile", format: "csv", fields: [] })
    ).toThrow("fields required");
  });
});
